import { formatUnits } from 'ethers'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SocketAPIStep } from '@ambire-common/interfaces/swapAndBridge'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import formatTime from '@common/utils/formatTime'

import RouteStepsArrow from '../RouteStepsArrow'
import getStyles from './styles'

const RouteStepsPreview = ({
  steps,
  totalGasFeesInUsd,
  estimationInSeconds,
  currentStep = 0,
  loadingEnabled
}: {
  steps: SocketAPIStep[]
  totalGasFeesInUsd?: number
  estimationInSeconds?: number
  currentStep?: number
  loadingEnabled?: boolean
}) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()

  const shouldWarnForLongEstimation = useMemo(() => {
    if (!estimationInSeconds) return false
    return estimationInSeconds > 3600 // 1 hour in seconds
  }, [estimationInSeconds])

  const formattedFromAmount = useMemo(() => {
    const fromStep = steps?.[0]
    if (!fromStep) return ''

    const fromAmount = `${formatDecimals(
      Number(formatUnits(fromStep.fromAmount, fromStep.fromAsset.decimals)),
      'precise'
    )}`

    if (fromAmount.length > 10) {
      return `${fromAmount.slice(0, 10)}...`
    }

    return fromAmount
  }, [steps])

  const formattedToAmount = useMemo(() => {
    const toStep = steps?.[steps.length - 1]
    if (!toStep) return ''

    const toAmount = `${formatDecimals(
      Number(formatUnits(toStep.toAmount, toStep.toAsset.decimals)),
      'precise'
    )}`

    if (toAmount.length > 10) {
      return `${toAmount.slice(0, 10)}...`
    }

    return toAmount
  }, [steps])

  return (
    <View style={flexbox.flex1}>
      <View style={styles.container}>
        {steps.map((step, i) => {
          if (step.userTxIndex === undefined) {
            // eslint-disable-next-line no-param-reassign
            step.userTxIndex = 0
          }

          if (i === steps.length - 1) {
            return (
              <Fragment key={step.type}>
                <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
                  <View style={styles.tokenContainer}>
                    <View style={styles.tokenWrapper}>
                      <TokenIcon
                        width={30}
                        height={30}
                        uri={step.fromAsset.icon}
                        chainId={step.fromAsset.chainId}
                        withNetworkIcon
                      />
                    </View>
                    <Text fontSize={14} weight="medium">
                      {step.fromAsset.symbol}
                    </Text>
                  </View>
                  <RouteStepsArrow
                    containerStyle={flexbox.flex1}
                    type={step.userTxIndex < currentStep ? 'success' : 'default'}
                    badge={
                      <>
                        <TokenIcon
                          uri={step.protocol.icon}
                          width={16}
                          height={16}
                          containerStyle={spacings.mrMi}
                        />
                        <Text
                          fontSize={12}
                          weight="medium"
                          appearance="secondaryText"
                          numberOfLines={1}
                        >
                          {step.protocol.displayName}
                        </Text>
                      </>
                    }
                    isLoading={loadingEnabled && step.userTxIndex === currentStep}
                    badgePosition="top"
                  />
                </View>
                <View style={styles.tokenContainer}>
                  <View style={styles.tokenWrapper}>
                    <TokenIcon
                      width={30}
                      height={30}
                      uri={step.toAsset.icon}
                      chainId={step.toAsset.chainId}
                      withNetworkIcon
                    />
                  </View>
                  <Text
                    fontSize={14}
                    weight="medium"
                    // @ts-ignore
                    style={[!!formattedToAmount && flexbox.alignSelfEnd, { whiteSpace: 'nowrap' }]}
                  >
                    {formattedToAmount ? `${formattedToAmount} ` : ''}
                    {step.toAsset.symbol}
                  </Text>
                </View>
              </Fragment>
            )
          }

          return (
            <View
              key={step.type}
              style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}
            >
              <View style={styles.tokenContainer}>
                <View style={styles.tokenWrapper}>
                  <TokenIcon
                    width={30}
                    height={30}
                    uri={step.fromAsset.icon}
                    chainId={step.fromAsset.chainId}
                    withNetworkIcon
                  />
                </View>
                <Text
                  fontSize={14}
                  weight="medium"
                  style={[
                    i === 0 && !!formattedFromAmount && flexbox.alignSelfStart,
                    // @ts-ignore
                    { whiteSpace: 'nowrap' }
                  ]}
                >
                  {i === 0 && !!formattedFromAmount ? `${formattedFromAmount} ` : ''}
                  {step.fromAsset.symbol}
                </Text>
              </View>
              <RouteStepsArrow
                containerStyle={flexbox.flex1}
                type={step.userTxIndex < currentStep ? 'success' : 'default'}
                badge={
                  <>
                    <TokenIcon
                      uri={step.protocol.icon}
                      width={16}
                      height={16}
                      containerStyle={spacings.mrMi}
                    />
                    <Text
                      fontSize={12}
                      weight="medium"
                      appearance="secondaryText"
                      numberOfLines={1}
                    >
                      {step.protocol.displayName}
                    </Text>
                  </>
                }
                isLoading={loadingEnabled && step.userTxIndex === currentStep}
                badgePosition="top"
              />
            </View>
          )
        })}
      </View>
      {(!!totalGasFeesInUsd || !!estimationInSeconds) && (
        <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.pt]}>
          <Text fontSize={12} weight="medium">
            {t('Total gas fees: {{fees}}', {
              fees: formatDecimals(totalGasFeesInUsd, 'price')
            })}
          </Text>
          {!!estimationInSeconds && (
            <>
              <Text fontSize={12} weight="medium" appearance="secondaryText">
                {'  |  '}
              </Text>
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                {!!shouldWarnForLongEstimation && (
                  <WarningIcon
                    color={iconColors.warning}
                    width={14}
                    height={14}
                    style={spacings.mrMi}
                    strokeWidth={2.2}
                  />
                )}
                <Text
                  fontSize={12}
                  weight={shouldWarnForLongEstimation ? 'semiBold' : 'medium'}
                  appearance={shouldWarnForLongEstimation ? 'warningText' : 'primaryText'}
                >
                  {t('Estimation: ~{{time}}', {
                    time: formatTime(estimationInSeconds)
                  })}
                </Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  )
}

export default React.memo(RouteStepsPreview)
