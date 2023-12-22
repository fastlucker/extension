import { Block, ethers, TransactionReceipt, TransactionResponse } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ImageBackground, Linking, ScrollView, View } from 'react-native'

import humanizerJSON from '@ambire-common/consts/humanizerInfo.json'
import { networks } from '@ambire-common/consts/networks'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter'
import { humanizeCalls } from '@ambire-common/libs/humanizer/humanizerFuncs'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { getNativePrice } from '@ambire-common/libs/humanizer/utils'
import bundler from '@ambire-common/services/bundlers'
import { Bundler } from '@ambire-common/services/bundlers/bundler'
// @ts-ignore
import meshGradientLarge from '@benzin/assets/images/mesh-gradient-large.png'
// @ts-ignore
import meshGradient from '@benzin/assets/images/mesh-gradient.png'
import Step from '@benzin/components/Step'
import { ActiveStepType, FinalizedStatusType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import humanizerModules from '@benzin/screens/BenzinScreen/utils/humanizerModules'
import reproduceCalls from '@benzin/screens/BenzinScreen/utils/reproduceCalls'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import Buttons from './components/Buttons'
import Header from './components/Header'
import getStyles, { IS_MOBILE_UP_BENZIN_BREAKPOINT } from './styles'
import { getFee, getFinalizedRows, getTimestamp, shouldShowTxnProgress } from './utils/rows'

const REFETCH_TIME = 10000 // 10 seconds

const emittedErrors: ErrorRef[] = []
const mockEmitError = (e: ErrorRef) => emittedErrors.push(e)
const standardOptions = { fetch, emitError: mockEmitError }

const BenzinScreen = () => {
  const [txn, setTxn] = useState<null | TransactionResponse>(null)
  const [userOp, setUserOp] = useState<{ status: null | string; txnId: null | string }>({
    status: null,
    txnId: null
  })
  const [txnReceipt, setTxnReceipt] = useState<{
    actualGasCost: null | BigInt
    from: null | string
    blockNumber: null | BigInt
  }>({ actualGasCost: null, from: null, blockNumber: null })
  const [blockData, setBlockData] = useState<null | Block>(null)
  const [nativePrice, setNativePrice] = useState<number>(0)
  const [activeStep, setActiveStep] = useState<ActiveStepType>('signed')
  const [finalizedStatus, setFinalizedStatus] = useState<FinalizedStatusType>({
    status: 'fetching'
  })
  const [cost, setCost] = useState<null | string>(null)
  const [calls, setCalls] = useState<IrCall[]>([])
  const [refetchReceiptCounter, setRefetchReceiptCounter] = useState<number>(0)

  const { styles } = useTheme(getStyles)
  const route = useRoute()

  const params = new URLSearchParams(route?.search)

  const txnId = params.get('txnId')
  const [networkId, isUserOp] = [params.get('networkId'), typeof params.get('userOp') === 'string']
  const network = networks.find((n) => n.id === networkId)

  useMemo(() => {
    if (!network) return

    getNativePrice(network, fetch)
      .then((fetchedPrice) => setNativePrice(parseFloat(fetchedPrice.toFixed(2))))
      .catch(() => setNativePrice(0))
  }, [network])

  useEffect(() => {
    if (!txnId || !network || !isUserOp || userOp.status !== null || txnReceipt.blockNumber) return

    Bundler.getStatusAndTxnId(txnId, network)
      .then((userOpStatusAndId: { status: string; transactionHash: null | string }) => {
        switch (userOpStatusAndId.status) {
          case 'rejected':
            setFinalizedStatus({ status: 'dropped' })
            setActiveStep('finalized')
            setUserOp({ status: userOpStatusAndId.status, txnId: null })
            break

          case 'not_found':
          case 'not_submitted':
            setFinalizedStatus({ status: 'fetching' })
            setActiveStep('in-progress')
            setUserOp({ status: userOpStatusAndId.status, txnId: null })
            break

          case 'submitted':
          case 'included':
          case 'failed':
            setUserOp({
              status: userOpStatusAndId.status,
              txnId: userOpStatusAndId.transactionHash
            })
            setActiveStep('in-progress')
            break

          default:
            throw new Error('Unhandled user operation status. Please contact support')
        }
      })
      .catch(() => setUserOp({ status: 'not_found', txnId: null }))
  }, [isUserOp, userOp, network, txnId, txnReceipt])

  useMemo(() => {
    if (!txnId || !network || !isUserOp || !userOp.status || txnReceipt.blockNumber) return

    bundler
      .getReceipt(txnId, network)
      .then((userOpReceipt: any) => {
        if (!userOpReceipt) {
          // if userOp.status is not found (not a recent user op)
          // and we have to receipt, it means the txn was dropped
          if (userOp.status === 'not_found') {
            setFinalizedStatus({ status: 'dropped' })
            setActiveStep('finalized')
            return
          }

          // rejection is handled on status level, no need to change the state
          if (userOp.status === 'rejected') {
            return
          }

          // if we have a status !== not_found | rejected, we are waiting
          // for the receipt and we try to refetch after REFETCH_TIME
          setTimeout(() => setRefetchReceiptCounter(refetchReceiptCounter + 1), REFETCH_TIME)
          return
        }

        setTxnReceipt({
          from: userOpReceipt.sender,
          actualGasCost: BigInt(userOpReceipt.actualGasCost),
          blockNumber: BigInt(userOpReceipt.receipt.blockNumber)
        })
        setUserOp({
          status: 'included',
          txnId: userOpReceipt.receipt.transactionHash
        })
        setFinalizedStatus(
          userOpReceipt.receipt.status === '0x1' ? { status: 'confirmed' } : { status: 'failed' }
        )
        setActiveStep('finalized')
      })
      .catch(() => null)
  }, [txnId, network, isUserOp, userOp, txnReceipt, refetchReceiptCounter])

  useMemo(() => {
    if (!network || txn || (isUserOp && userOp.txnId === null)) return

    const finalTxnId = userOp.txnId ?? txnId
    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .getTransaction(finalTxnId!)
      .then((fetchedTxn: null | TransactionResponse) => {
        if (!fetchedTxn) {
          setFinalizedStatus({ status: 'dropped' })
          setActiveStep('finalized')
          return
        }

        setTxn(fetchedTxn)
      })
      .catch(() => null)
  }, [txnId, network, userOp, isUserOp, txn])

  useMemo(() => {
    if (!network || isUserOp || txnReceipt.blockNumber) return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .getTransactionReceipt(txnId!)
      .then((receipt: null | TransactionReceipt) => {
        if (!receipt) {
          // if there is a txn but no receipt, it means it is pending
          if (txn) {
            setTimeout(() => setRefetchReceiptCounter(refetchReceiptCounter + 1), REFETCH_TIME)
            setFinalizedStatus({ status: 'fetching' })
            setActiveStep('in-progress')
            return
          }

          // just stop the execution if txn is null becase we might
          // not have fetched it, yet
          // if txn is null, logic for dropping the txn is handled there
          return
        }

        setTxnReceipt({
          from: receipt.from,
          actualGasCost: receipt.gasUsed * receipt.gasPrice,
          blockNumber: BigInt(receipt.blockNumber)
        })
        setFinalizedStatus(receipt.status ? { status: 'confirmed' } : { status: 'failed' })
        setActiveStep('finalized')
      })
      .catch(() => null)
  }, [txnId, network, isUserOp, txnReceipt, txn, refetchReceiptCounter])

  // check for error reason
  useMemo(() => {
    if (
      !network ||
      !txn ||
      (finalizedStatus && finalizedStatus.status !== 'failed') ||
      (finalizedStatus && finalizedStatus.reason)
    )
      return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .call({
        to: txn.to,
        from: txn.from,
        nonce: txn.nonce,
        gasLimit: txn.gasLimit,
        gasPrice: txn.gasPrice,
        data: txn.data,
        value: txn.value,
        chainId: txn.chainId,
        type: txn.type ?? undefined,
        accessList: txn.accessList
      })
      .then(() => null)
      .catch((error: Error) => {
        if (error.message.includes('missing revert data')) {
          setFinalizedStatus({
            status: 'failed',
            reason: 'Contract execution reverted'
          })
          return
        }

        setFinalizedStatus({
          status: 'failed',
          reason:
            error.message.length > 20
              ? `${error.message.substring(0, 25)}... (check link for further details)`
              : error.message
        })
      })
  }, [network, txn, finalizedStatus])

  // get block
  useMemo(() => {
    if (!network || !txnReceipt.blockNumber || blockData !== null) return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .getBlock(Number(txnReceipt.blockNumber))
      .then((fetchedBlockData) => {
        setBlockData(fetchedBlockData)
      })
      .catch(() => null)
  }, [network, txnReceipt, blockData])

  useEffect(() => {
    if (network && txnReceipt.from && txn) {
      setCost(ethers.formatEther(txnReceipt.actualGasCost!.toString()))
      const accountOp = {
        accountAddr: txnReceipt.from!,
        networkId: network.id,
        signingKeyAddr: txnReceipt.from!, // irrelevant
        signingKeyType: 'internal', // irrelevant
        nonce: BigInt(0), // irrelevant
        calls: reproduceCalls(txn, txnReceipt.from, isUserOp),
        gasLimit: Number(txn.gasLimit),
        signature: '0x', // irrelevant
        gasFeePayment: null,
        accountOpToExecuteBefore: null,
        humanizerMeta: humanizerJSON
      }
      setCalls(humanizeCalls(accountOp, humanizerModules, standardOptions)[0])
    }
  }, [network, txnReceipt, txn, isUserOp])

  const handleOpenExplorer = useCallback(async () => {
    if (!network) return
    await Linking.openURL(`${network.explorerUrl}/tx/${txnId}`)
  }, [network, txnId])

  if (!network || !txnId) {
    // @TODO
    return <Text>Error loading transaction</Text>
  }

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={IS_SCREEN_SIZE_DESKTOP_LARGE ? meshGradientLarge : meshGradient}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Header activeStep={activeStep} network={network} />
          <View style={styles.steps}>
            <Step
              title="Signed"
              stepName="signed"
              activeStep={activeStep}
              rows={[
                {
                  label: 'Timestamp',
                  value: getTimestamp(blockData, finalizedStatus)
                },
                {
                  label: 'Transaction fee',
                  value: getFee(cost, network, nativePrice, finalizedStatus)
                },
                {
                  label: 'Transaction ID',
                  value: txnId,
                  isValueSmall: true
                }
              ]}
            />
            {shouldShowTxnProgress(finalizedStatus) && (
              <Step
                title={
                  activeStep === 'finalized'
                    ? 'Transaction details'
                    : 'Your transaction is in progress'
                }
                stepName="in-progress"
                activeStep={activeStep}
                finalizedStatus={finalizedStatus}
              >
                {calls.map((call, i) => {
                  return (
                    <TransactionSummary
                      key={call.data + ethers.randomBytes(6)}
                      style={i !== calls.length! - 1 ? spacings.mbSm : {}}
                      call={call}
                      networkId={network!.id}
                      explorerUrl={network!.explorerUrl}
                      rightIcon={
                        <OpenIcon
                          width={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 14}
                          height={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 14}
                        />
                      }
                      onRightIconPress={handleOpenExplorer}
                      size={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 'lg' : 'sm'}
                    />
                  )
                })}
              </Step>
            )}
            <Step
              title={
                finalizedStatus && finalizedStatus.status ? finalizedStatus.status : 'Fetching'
              }
              stepName="finalized"
              finalizedStatus={finalizedStatus}
              activeStep={activeStep}
              style={spacings.pb0}
              titleStyle={spacings.mb0}
            />
            {activeStep === 'finalized' ? (
              <Step
                style={{
                  ...spacings[IS_MOBILE_UP_BENZIN_BREAKPOINT ? 'pt' : 'ptSm'],
                  borderWidth: 0
                }}
                rows={getFinalizedRows(blockData, finalizedStatus)}
              />
            ) : null}
          </View>
          <Buttons handleOpenExplorer={handleOpenExplorer} />
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

export default BenzinScreen
