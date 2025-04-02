import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import PinExtensionIcon from '@common/assets/svg/PinExtensionIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import ConfettiAnimation from '@common/modules/dashboard/components/ConfettiAnimation'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useWalletStateController from '@web/hooks/useWalletStateController'

import getStyles from './styles'

export const CARD_WIDTH = 400

const OnboardingCompletedScreen = () => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { isPinned } = useWalletStateController()

  const { theme, styles } = useTheme(getStyles)

  useEffect(() => {
    dispatch({ type: 'SET_IS_SETUP_COMPLETE', params: { isSetupComplete: true } })
  }, [dispatch])

  const handleOpenDashboardPress = useCallback(async () => {
    dispatch({ type: 'OPEN_EXTENSION_POPUP' })
  }, [dispatch])

  return (
    <>
      {!isPinned && (
        <View style={styles.pinExtensionIcon}>
          <PinExtensionIcon />
        </View>
      )}
      <TabLayoutContainer
        backgroundColor={theme.secondaryBackground}
        header={<Header customTitle={' '} />}
      >
        <TabLayoutWrapperMainContent>
          <Panel
            spacingsSize="small"
            style={{
              width: CARD_WIDTH,
              alignSelf: 'center',
              ...common.shadowTertiary,
              minHeight: 416
            }}
          >
            <View style={[flexbox.alignCenter, spacings.pv3Xl]}>
              <View style={[flexbox.alignCenter, flexbox.justifyCenter]}>
                <ConfettiAnimation width={TAB_CONTENT_WIDTH} height={350} autoPlay={false} />
                <AmbireLogo height={96} />
              </View>
              <Text
                style={[spacings.mtLg, isPinned ? spacings.mbXl : spacings.mb, text.center]}
                weight="semiBold"
                fontSize={20}
              >
                {t('Ambire Wallet is Ready to Use')}
              </Text>
              {!isPinned && (
                <Text appearance="secondaryText" weight="medium" style={[text.center]}>
                  {t('Pin the Ambire Extension to your toolbar for easy access.')}
                </Text>
              )}

              {!!isPinned && (
                <Button
                  text={t('Open Dashboard')}
                  hasBottomSpacing={false}
                  onPress={handleOpenDashboardPress}
                />
              )}
            </View>
          </Panel>
        </TabLayoutWrapperMainContent>
      </TabLayoutContainer>
    </>
  )
}

export default React.memo(OnboardingCompletedScreen)
