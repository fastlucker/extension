import { Block, ethers, TransactionReceipt, TransactionResponse } from 'ethers'
import { setStringAsync } from 'expo-clipboard'
import fetch from 'node-fetch'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ImageBackground, Linking, Pressable, ScrollView, View } from 'react-native'

import humanizerJSON from '@ambire-common/consts/humanizerInfo.json'
import { networks } from '@ambire-common/consts/networks'
import { ErrorRef } from '@ambire-common/controllers/eventEmitter'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { humanizeCalls } from '@ambire-common/libs/humanizer/humanizerFuncs'
import { HumanizerCallModule, IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { aaveHumanizer } from '@ambire-common/libs/humanizer/modules/Aave'
import { fallbackHumanizer } from '@ambire-common/libs/humanizer/modules/fallBackHumanizer'
import { gasTankModule } from '@ambire-common/libs/humanizer/modules/gasTankModule'
import { sushiSwapModule } from '@ambire-common/libs/humanizer/modules/sushiSwapModule'
import {
  genericErc20Humanizer,
  genericErc721Humanizer
} from '@ambire-common/libs/humanizer/modules/tokens'
import { uniswapHumanizer } from '@ambire-common/libs/humanizer/modules/Uniswap'
import { WALLETModule } from '@ambire-common/libs/humanizer/modules/WALLET'
import { wrappingModule } from '@ambire-common/libs/humanizer/modules/wrapped'
import { yearnVaultModule } from '@ambire-common/libs/humanizer/modules/yearnTesseractVault'
import { getNativePrice } from '@ambire-common/libs/humanizer/utils'
import { Bundler } from '@ambire-common/services/bundlers/bundler'
// @ts-ignore
import meshGradientLarge from '@benzin/assets/images/mesh-gradient-large.png'
// @ts-ignore
import meshGradient from '@benzin/assets/images/mesh-gradient.png'
import Step from '@benzin/components/Step'
import AmbireLogo from '@common/assets/svg/AmbireLogo'
import CopyIcon from '@common/assets/svg/CopyIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Button from '@common/components/Button'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import getStyles, { IS_MOBILE_UP_BENZIN_BREAKPOINT } from './styles'

type ActiveStepType = 'signed' | 'in-progress' | 'finalized'

export type FinalizedStatusType = {
  status: 'confirmed' | 'cancelled' | 'dropped' | 'replaced' | 'failed' | 'fetching'
  reason?: string
} | null

const getDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h12'
  })
}

const humanizerModules: HumanizerCallModule[] = [
  genericErc20Humanizer,
  genericErc721Humanizer,
  gasTankModule,
  uniswapHumanizer,
  wrappingModule,
  aaveHumanizer,
  WALLETModule,
  yearnVaultModule,
  sushiSwapModule,
  fallbackHumanizer
]

const executeInterface = new ethers.Interface([
  'function execute(tuple(address, uint256, bytes)[] calldata calls, bytes calldata signature) public payable'
])
const executeMultipleInterface = new ethers.Interface([
  'function executeMultiple(tuple(tuple(address, uint256, bytes)[] calls, bytes signature)[] calldata toExec) external payable'
])
const transferInterface = new ethers.Interface([
  'function transfer(address recipient, uint256 amount) external returns (bool)'
])
const deployAndExecuteInterface = new ethers.Interface([
  'function deployAndExecute(bytes calldata code, uint256 salt, tuple(address, uint256, bytes)[] calldata txns, bytes calldata signature) external returns (address)'
])

const deployAndExecuteMultipleInterface = new ethers.Interface([
  'function deployAndExecuteMultiple(bytes calldata code, uint256 salt, tuple(tuple(address, uint256, bytes)[] calls, bytes signature)[] calldata toExec) external returns (address)'
])

const feeCollector = '0x942f9CE5D9a33a82F88D233AEb3292E680230348'

const emitedErrors: ErrorRef[] = []
const mockEmitError = (e: ErrorRef) => emitedErrors.push(e)
const standartOptions = { fetch, emitError: mockEmitError }

const filterFeeCollectorCalls = (callsLength: number, callArray: any) => {
  // if calls are exactly one, it means no fee collector calls
  if (callsLength === 1) return true
  if (
    callArray[2].slice(0, 10) === transferInterface.getFunction('transfer')!.selector &&
    transferInterface.decodeFunctionData('transfer', callArray[2])[0] === feeCollector
  ) {
    return false
  }
  if (callArray[0] === feeCollector) return false

  return true
}

const transformToAccOpCall = (call: any) => {
  return {
    to: call[0],
    value: BigInt(call[1]),
    data: call[2]
  }
}

const reproduceCalls = (txn: TransactionResponse) => {
  const sigHash = txn.data.slice(0, 10)

  if (sigHash === executeInterface.getFunction('execute')!.selector) {
    const data = executeInterface.decodeFunctionData('execute', txn.data)
    return data[0]
      .filter((call: any) => filterFeeCollectorCalls(data[0].length, call))
      .map((call: any) => transformToAccOpCall(call))
  }

  if (sigHash === deployAndExecuteInterface.getFunction('deployAndExecute')!.selector) {
    const data = deployAndExecuteInterface.decodeFunctionData('deployAndExecute', txn.data)
    return data[2]
      .filter((call: any) => filterFeeCollectorCalls(data[2].length, call))
      .map((call: any) => transformToAccOpCall(call))
  }

  if (sigHash === executeMultipleInterface.getFunction('executeMultiple')!.selector) {
    const data = executeMultipleInterface.decodeFunctionData('executeMultiple', txn.data)
    const calls = data[0].map((executeArgs: any) => executeArgs[0]).flat()
    return calls
      .filter((call: any) => filterFeeCollectorCalls(calls.length, call))
      .map((call: any) => transformToAccOpCall(call))
  }

  if (
    sigHash === deployAndExecuteMultipleInterface.getFunction('deployAndExecuteMultiple')!.selector
  ) {
    const data = deployAndExecuteMultipleInterface.decodeFunctionData(
      'deployAndExecuteMultiple',
      txn.data
    )
    const calls: any = data[2].map((executeArgs: any) => executeArgs[0]).flat()
    return calls
      .filter((call: any) => filterFeeCollectorCalls(calls.length, call))
      .map((call: any) => transformToAccOpCall(call))
  }

  return [transformToAccOpCall([txn.to ? txn.to : ethers.ZeroAddress, txn.value, txn.data])]
}

const shouldShowTxnProgress = (finalizedStatus: FinalizedStatusType) => {
  if (!finalizedStatus) return true

  const doNotShow = ['cancelled', 'dropped', 'replaced']
  return doNotShow.indexOf(finalizedStatus.status) === -1
}

const getTimestamp = (blockData: null | Block, finalizedStatus: FinalizedStatusType) => {
  if (blockData) {
    return getDate(blockData.timestamp)
  }

  return finalizedStatus && finalizedStatus.status === 'dropped' ? '-' : 'Fetching...'
}

const getBlockNumber = (blockData: null | Block, finalizedStatus: FinalizedStatusType) => {
  if (blockData) {
    return blockData.number.toString()
  }

  return finalizedStatus && finalizedStatus.status === 'dropped' ? '-' : 'Fetching...'
}

const getFee = (
  cost: null | string,
  network: NetworkDescriptor,
  nativePrice: number,
  finalizedStatus: FinalizedStatusType
) => {
  if (cost) {
    return `${cost} ${network.nativeAssetSymbol} ($${nativePrice})`
  }

  return finalizedStatus && finalizedStatus.status === 'dropped' ? '-' : 'Fetching...'
}

const TransactionProgressScreen = () => {
  const [txn, setTxn] = useState<null | TransactionResponse>(null)
  const [userOp, setUserOp] = useState<{ status: null | string; txnId: null | string }>({
    status: null,
    txnId: null
  })
  const [txnReceipt, setTxnReceipt] = useState<null | TransactionReceipt>(null)
  const [blockData, setBlockData] = useState<null | Block>(null)
  const [nativePrice, setNativePrice] = useState<number>(0)
  const [activeStep, setActiveStep] = useState<ActiveStepType>('signed')
  const [finalizedStatus, setFinalizedStatus] = useState<FinalizedStatusType>({
    status: 'fetching'
  })
  const [cost, setCost] = useState<null | string>(null)
  const [calls, setCalls] = useState<IrCall[]>([])

  const { theme, styles } = useTheme(getStyles)
  const route = useRoute()
  const { addToast } = useToast()

  const params = new URLSearchParams(route?.search)

  const txnId = userOp.txnId ?? params.get('txnId')
  const [networkId, isUserOp] = [params.get('networkId'), typeof params.get('userOp') === 'string']
  const network = networks.find((n) => n.id === networkId)

  useEffect(() => {
    if (!txnId || !network || !isUserOp || userOp.status !== null) return

    Bundler.getStatusAndTxnId(txnId, network)
      .then((userOpStatusAndId: { status: string; transactionHash: null | string }) => {
        switch (userOpStatusAndId.status) {
          case 'not_found':
          case 'rejected':
            setFinalizedStatus({ status: 'dropped' })
            setActiveStep('finalized')
            setUserOp({ status: userOpStatusAndId.status, txnId: null })
            break

          case 'not_submitted':
            setFinalizedStatus({ status: 'fetching' })
            setActiveStep('in-progress')
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
      .catch(() => null)
  }, [isUserOp, userOp, network, txnId])

  useMemo(() => {
    if (!network) return

    // no execution if the request is 4337 and we haven't fetched
    // any info for the user operation
    if (isUserOp && userOp.status === null) return

    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .getTransaction(txnId!)
      .then((fetchedTxn: null | TransactionResponse) => {
        // if there is no transaction, it means it has been dropped
        if (!fetchedTxn) {
          setFinalizedStatus({ status: 'dropped' })
          setActiveStep('finalized')
          return
        }

        setTxn(fetchedTxn)
      })
      .catch(() => null)
    provider
      .getTransactionReceipt(txnId!)
      .then((receipt: null | TransactionReceipt) => {
        if (!receipt) {
          // @TODO: think what should happen here as it could be pending
          // maybe set an interval to refetch the transaction

          // if there is not transaction, obv there will be no receipt
          // in that case, we need to stop with dropped
          return
        }
        provider
          .getBlock(Number(receipt.blockNumber))
          .then((fetchedBlockData) => {
            setTxnReceipt(receipt)
            setBlockData(fetchedBlockData)

            setFinalizedStatus(receipt.status ? { status: 'confirmed' } : { status: 'failed' })
            setActiveStep('finalized')
          })
          .catch(() => null)
      })
      .catch(() => null)
    getNativePrice(network, fetch)
      .then((fetchedPrice) => setNativePrice(parseFloat(fetchedPrice.toFixed(2))))
      .catch(() => setNativePrice(0))
  }, [txnId, network, isUserOp, userOp])

  useEffect(() => {
    if (network && txnReceipt && txn) {
      setCost(ethers.formatEther(txnReceipt.gasUsed * txnReceipt.gasPrice))
      const accountOp = {
        accountAddr: txnReceipt.from,
        networkId: network.id,
        signingKeyAddr: txnReceipt.from, // irrelevant
        signingKeyType: 'internal', // irrelevant
        nonce: BigInt(0), // irrelevant
        calls: reproduceCalls(txn),
        gasLimit: Number(txn.gasLimit),
        signature: '0x', // irrelevant
        gasFeePayment: null,
        accountOpToExecuteBefore: null,
        humanizerMeta: humanizerJSON
      }
      setCalls(humanizeCalls(accountOp, humanizerModules, standartOptions)[0])
    }
  }, [network, txnReceipt, txn])

  const handleOpenExplorer = useCallback(async () => {
    if (!network) return
    await Linking.openURL(`${network.explorerUrl}/tx/${txnId}`)
  }, [network, txnId])

  const handleCopyText = async () => {
    try {
      await setStringAsync(window.location.href)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }

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
          <View
            style={[
              IS_MOBILE_UP_BENZIN_BREAKPOINT
                ? {}
                : { flexDirection: 'row-reverse', ...flexbox.justifySpaceBetween },
              IS_MOBILE_UP_BENZIN_BREAKPOINT ? {} : spacings.mbXl,
              flexbox.alignCenter
            ]}
          >
            <View style={styles.logoWrapper}>
              <AmbireLogo
                width={148 / (IS_MOBILE_UP_BENZIN_BREAKPOINT ? 1 : 1.8)}
                height={69 / (IS_MOBILE_UP_BENZIN_BREAKPOINT ? 1 : 1.8)}
              />
            </View>
            <Text
              fontSize={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 18}
              weight="medium"
              style={[
                activeStep === 'finalized' && IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mb3Xl : {},
                IS_MOBILE_UP_BENZIN_BREAKPOINT ? { textAlign: 'center' } : { marginLeft: -8 }
              ]}
            >
              Transaction Progress
            </Text>
          </View>
          {activeStep !== 'finalized' ? (
            <View style={styles.estimate}>
              <Text appearance="secondaryText" fontSize={14}>
                Est time remaining 5 mins on
              </Text>
              <NetworkIcon name="ethereum" />
              <Text appearance="secondaryText" fontSize={14}>
                {network.name}
              </Text>
            </View>
          ) : null}
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
                finalizedStatus && finalizedStatus?.status !== 'confirmed'
                  ? `${finalizedStatus.status}${
                      finalizedStatus?.reason ? `: ${finalizedStatus.reason}` : ''
                    }`
                  : 'Confirmed'
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
                rows={[
                  {
                    label: 'Timestamp',
                    value: getTimestamp(blockData, finalizedStatus)
                  },
                  {
                    label: 'Block number',
                    value: getBlockNumber(blockData, finalizedStatus)
                  }
                ]}
              />
            ) : null}
          </View>
          <View style={styles.buttons}>
            <Pressable style={styles.openExplorer}>
              <OpenIcon
                width={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 16}
                height={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 16}
                color={theme.primary}
              />
              <Text
                fontSize={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 16 : 14}
                appearance="primary"
                weight="medium"
                style={styles.openExplorerText}
                onPress={handleOpenExplorer}
              >
                Open explorer
              </Text>
            </Pressable>
            <Button
              style={{
                width: IS_MOBILE_UP_BENZIN_BREAKPOINT ? 200 : '100%',
                ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mlLg : {}),
                ...(IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mb0 : spacings.mbMd)
              }}
            >
              <CopyIcon color="#fff" />
              <Text
                style={{ color: '#fff', ...spacings.mlSm }}
                fontSize={16}
                weight="medium"
                onPress={handleCopyText}
              >
                Copy link
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

export default TransactionProgressScreen
