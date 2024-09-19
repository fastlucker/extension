import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import SwapBridgeToggleIcon from '@common/assets/svg/SwapBridgeToggleIcon'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import getStyles from './styles'

const SwapAndBridgeScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { accountPortfolio } = usePortfolioControllerState()
  const { t } = useTranslation()

  // TODO: Wire-up with the UI
  // TODO: Disable tokens that are NOT supported
  // (not in the `fromTokenList` of the SwapAndBridge controller)
  const fromTokenList = useMemo(
    () =>
      accountPortfolio?.tokens.filter((token) => {
        const hasAmount = Number(getTokenAmount(token)) > 0

        return hasAmount && !token.flags.onGasTank && !token.flags.rewardsType
      }) || [],
    [accountPortfolio?.tokens]
  )

  // TODO: Changing the FROM token (and chain), should:
  // 1. If the next FROM chain is different than the previous - fetch the `fromTokenList` and the `toTokenList`:
  // 1. Update quote or reset the amount to 0 (TBD)

  // TODO: Changing the TO token, should:
  // 1. Update quote or reset the amount to 0 (TBD)

  // TODO: Changing the TO chain, should:
  // 1. Fetch the `toTokenList`
  // 2. Update quote (TBD)

  // TODO: Changing the FROM amount should:
  // 1. Update quote

  // TODO: Changing the TO amount should be disabled.

  // TODO: Confirmation modal (warn) if the diff in dollar amount between the
  // FROM and TO tokens is too high (therefore, user will lose money).

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
