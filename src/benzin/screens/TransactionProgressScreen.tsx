import React from 'react'
import { ImageBackground, Pressable, View } from 'react-native'

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
import useTheme from '@common/hooks/useTheme'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'

import getStyles from './styles'

type ActiveStepType = 'signed' | 'in-progress' | 'finalized'

export type FinalizedStatusType = {
  status: 'confirmed' | 'cancelled' | 'dropped' | 'replaced' | 'failed'
  reason?: string
} | null

const TransactionProgressScreen = () => {
  const { theme, styles } = useTheme(getStyles)

  const activeStep: ActiveStepType = 'finalized'
  // const finalizedStatus: FinalizedStatusType = null
  const finalizedStatus: FinalizedStatusType = {
    status: 'replaced',
    reason: 'By your request'
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
              Ethereum
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
                value: '0xb31f8cb1e84c59d449748242a3093ad8720c3cb01fa6a8f340f44713f95394d2',
                isValueSmall: true
              }
            ]}
          />
          <Step
            title="Your transaction is in progress"
            stepName="in-progress"
            activeStep={activeStep}
          />
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
        </View>
        {activeStep === 'finalized' ? (
          <Step
            style={{ borderWidth: 0 }}
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
        <View style={styles.buttons}>
          <Pressable style={styles.openExplorer}>
            <OpenIcon color={theme.primary} />
            <Text
              fontSize={16}
              appearance="primary"
              weight="medium"
              style={styles.openExplorerText}
            >
              Open explorer
            </Text>
          </Pressable>
          <Button style={{ width: 200, ...spacings.mlLg, ...spacings.mb0 }}>
            <CopyIcon color="#fff" />
            <Text style={{ color: '#fff', ...spacings.mlSm }} fontSize={16} weight="medium">
              Copy link
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default TransactionProgressScreen
