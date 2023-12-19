import { ethers } from 'ethers'
import { setStringAsync } from 'expo-clipboard'
import fetch from 'node-fetch'
import React, { useCallback, useMemo, useState } from 'react'
import { ImageBackground, Linking, Pressable, ScrollView, View } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import { parse } from '@ambire-common/libs/bigintJson/bigintJson'
import { getNativePrice } from '@ambire-common/libs/humanizer/utils'
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

const callsToVisualize = [
  parse(
    '{"to":"0x6ab707Aca953eDAeFBc4fD23bA73294241490620","value":{"$bigint":"0"},"data":"0xa9059cbb000000000000000000000000fe89cc7abb2c4183683ab71653c4cdc9b02d44b700000000000000000000000000000000000000000000000000000010d947186a","fromUserRequestId":1702630056993,"fullVisualization":[{"type":"action","content":"Send"},{"type":"token","address":"0x6ab707Aca953eDAeFBc4fD23bA73294241490620","amount":{"$bigint":"72364791914"},"symbol":"AUSDT","decimals":6,"readableAmount":"72364.791914"},{"type":"label","content":"to"},{"type":"address","address":"0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7","name":"0xFe8...4b7"}],"warnings":[{"content":"Unknown address","level":"caution"}]}'
  )
]

export type FinalizedStatusType = {
  status: 'confirmed' | 'cancelled' | 'dropped' | 'replaced' | 'failed'
  reason?: string
} | null

const activeStep: ActiveStepType = 'finalized'
const finalizedStatus: FinalizedStatusType = {
  status: 'confirmed'
}

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

const TransactionProgressScreen = () => {
  const [txnData, setTxnData] = useState<null | ethers.TransactionReceipt>(null)
  const [blockData, setBlockData] = useState<null | ethers.Block>(null)
  const [nativePrice, setNativePrice] = useState<number>(0)
  const { theme, styles } = useTheme(getStyles)
  const route = useRoute()
  const { addToast } = useToast()

  const params = new URLSearchParams(route?.search)

  const [txnId, networkId, isUserOp] = [
    params.get('txnId'),
    params.get('networkId'),
    typeof params.get('userOp') === 'string'
  ]

  const network = networks.find((n) => n.id === networkId)

  if (!network || !txnId) {
    // @TODO
    return <Text>Error loading transaction</Text>
  }

  useMemo(() => {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl)
    provider
      .getTransactionReceipt(txnId)
      .then((fetchedTxnData) => {
        if (!fetchedTxnData) {
          // @TODO set the state to txn ID not found
          return
        }
        provider
          .getBlock(Number(fetchedTxnData.blockNumber))
          .then((fetchedBlockData) => {
            setTxnData(fetchedTxnData)
            setBlockData(fetchedBlockData)
          })
          .catch(() => null)
      })
      .catch(() => null)
    getNativePrice(network, fetch)
      .then((fetchedPrice) => setNativePrice(parseFloat(fetchedPrice.toFixed(2))))
      .catch(() => setNativePrice(0))
  }, [txnId, network])

  // @TODO
  // 1. humanizer
  let cost
  if (txnData) {
    cost = ethers.formatEther(txnData.gasUsed * txnData.gasPrice)
  }

  const handleOpenExplorer = useCallback(async () => {
    await Linking.openURL(`${network.explorerUrl}/tx/${txnId}`)
  }, [network.explorerUrl, txnId])

  const handleCopyText = async () => {
    try {
      await setStringAsync(window.location.href)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
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
                  value: blockData ? getDate(blockData.timestamp) : 'Fetching...'
                },
                {
                  label: 'Transaction fee',
                  value: cost
                    ? `${cost} ${network.nativeAssetSymbol} ($${nativePrice})`
                    : 'Fetching...'
                },
                {
                  label: 'Transaction ID',
                  value: txnId,
                  isValueSmall: true
                }
              ]}
            />
            <Step
              title="Your transaction is in progress"
              stepName="in-progress"
              activeStep={activeStep}
              finalizedStatus={finalizedStatus}
            >
              {callsToVisualize.map((call, i) => {
                return (
                  <TransactionSummary
                    key={call.data + call.fromUserRequestId}
                    style={i !== callsToVisualize.length - 1 ? spacings.mbSm : {}}
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
                    value: blockData ? getDate(blockData.timestamp) : 'Fetching...'
                  },
                  {
                    label: 'Block number',
                    value:
                      txnData && txnData.blockNumber
                        ? txnData.blockNumber.toString()
                        : 'Fetching...'
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
