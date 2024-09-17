import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import SwapBridgeToggleIcon from '@common/assets/svg/SwapBridgeToggleIcon'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'

import getStyles from './styles'

const SwapAndBridgeScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="sm"
      header={<HeaderAccountAndNetworkInfo />}
    >
      <TabLayoutWrapperMainContent contentContainerStyle={spacings.pt2Xl}>
        <Panel title={t('Swap & Bridge')} forceContainerSmallSpacings>
          <View>
            <Text appearance="secondaryText" fontSize={14} weight="regular" style={spacings.mbMi}>
              {t('Send')}
            </Text>
            <View style={styles.selectorContainer}>
              <Text>0</Text>
            </View>
          </View>
        </Panel>
        <View style={styles.swapAndBridgeToggleButtonWrapper}>
          <Pressable style={styles.swapAndBridgeToggleButton}>
            <SwapBridgeToggleIcon />
          </Pressable>
        </View>
        <Panel forceContainerSmallSpacings>
          <View>
            <Text appearance="secondaryText" fontSize={14} weight="regular" style={spacings.mbMi}>
              {t('Receive')}
            </Text>
            <View style={styles.selectorContainer}>
              <Text>0</Text>
            </View>
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(SwapAndBridgeScreen)
