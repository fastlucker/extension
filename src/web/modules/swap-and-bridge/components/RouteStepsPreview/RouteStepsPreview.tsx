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
  estimationInSeconds
}: {
  steps: SocketAPIStep[]
  totalGasFeesInUsd: number
  estimationInSeconds: number
}) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()

  const shouldWarnForLongEstimation = useMemo(
    () => estimationInSeconds > 3600, // 1 hour in seconds
    [estimationInSeconds]
  )

  return (
    <View style={flexbox.flex1}>
      <View style={[styles.container, spacings.mb]}>
        {steps.map((step, i) => {
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
                    type="default"
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
                  <Text fontSize={14} weight="medium">
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
                <Text fontSize={14} weight="medium">
                  {step.fromAsset.symbol}
                </Text>
              </View>
              <RouteStepsArrow
                containerStyle={flexbox.flex1}
                type="default"
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
                badgePosition="top"
              />
            </View>
          )
        })}
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <Text fontSize={12} weight="medium">
          {t('Total gas fees: {{fees}}', {
            fees: formatDecimals(totalGasFeesInUsd, 'price')
          })}
        </Text>
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
      </View>
    </View>
  )
}

export default React.memo(RouteStepsPreview)
