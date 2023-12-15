import { setStringAsync } from 'expo-clipboard'
import React, { useCallback } from 'react'
import { ImageBackground, Linking, Pressable, View } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import { parse } from '@ambire-common/libs/bigintJson/bigintJson'
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
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import getStyles from './styles'

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
  status: 'cancelled',
  reason: 'User cancelled'
}

const TransactionProgressScreen = () => {
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
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={IS_SCREEN_SIZE_DESKTOP_LARGE ? meshGradientLarge : meshGradient}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <AmbireLogo width={148} height={69} />
        </View>
        <Text
          fontSize={20}
          weight="medium"
          style={[activeStep === 'finalized' ? spacings.mb3Xl : {}, { textAlign: 'center' }]}
        >
          Transaction Progress
        </Text>
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
                value: '04 APR 2023, 1:45 PM'
              },
              {
                label: 'Transaction fee',
                value: '0.001487535107372448 ETH ($2.78)'
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
                  rightIcon={<OpenIcon />}
                  onRightIconPress={handleOpenExplorer}
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
              style={{ ...spacings.pt, borderWidth: 0 }}
              rows={[
                {
                  label: 'Timestamp',
                  value: '04 APR 2023, 1:45 PM'
                },
                {
                  label: 'Block number',
                  value: '17087709'
                }
              ]}
            />
          ) : null}
        </View>
        <View style={styles.buttons}>
          <Pressable style={styles.openExplorer}>
            <OpenIcon color={theme.primary} />
            <Text
              fontSize={16}
              appearance="primary"
              weight="medium"
              style={styles.openExplorerText}
              onPress={handleOpenExplorer}
            >
              Open explorer
            </Text>
          </Pressable>
          <Button style={{ width: 200, ...spacings.mlLg, ...spacings.mb0 }}>
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
    </View>
  )
}

export default TransactionProgressScreen
