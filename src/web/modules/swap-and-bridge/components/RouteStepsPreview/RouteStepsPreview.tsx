import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SocketAPIStep } from '@ambire-common/interfaces/swapAndBridge'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import RouteStepsArrow from '../RouteStepsArrow'
import getStyles from './styles'

const RouteStepsPreview = ({ steps }: { steps: SocketAPIStep[] }) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
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
          <View key={step.type} style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
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
                  <Text fontSize={12} weight="medium" appearance="secondaryText" numberOfLines={1}>
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
  )
}

export default React.memo(RouteStepsPreview)
