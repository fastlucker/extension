import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import ViewModeIcon from '@common/assets/svg/ViewModeIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import getPanelStyles from '@common/components/Panel/styles'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useWalletStateController from '@web/hooks/useWalletStateController'

import getStyles from './styles'

export const CARD_WIDTH = 400

const GetStartedScreen = () => {
  const { theme } = useTheme(getStyles)
  const { styles: panelStyles } = useTheme(getPanelStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { goToNextRoute } = useOnboardingNavigation()

  const accountAdderCtrlState = useAccountAdderControllerState()
  const animation = useRef(new Animated.Value(0)).current
  const { authStatus } = useAuth()
  const { dispatch } = useBackgroundService()

  const state = useWalletStateController()

  const resetIsSetupCompleteIfNeeded = useCallback(() => {
    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED && !state.isPinned && state.isSetupComplete) {
      dispatch({ type: 'SET_IS_SETUP_COMPLETE', params: { isSetupComplete: false } })
    }
  }, [authStatus, dispatch, state.isPinned, state.isSetupComplete])

  useEffect(() => {
    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
      navigate(ROUTES.dashboard)
      return
    }

    resetIsSetupCompleteIfNeeded()
  }, [authStatus, navigate, resetIsSetupCompleteIfNeeded])

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 480,
      useNativeDriver: false
    }).start()
  }, [animation])

  // here's the bug for the code below:
  // 1. Go through get started and create a seed
  // 2. Close account adder without adding any new accounts
  // 3. If you open get started, you have loads of options - you should not
  // as you've already created a seed and have to finish that
  useEffect(() => {
    if (
      accountAdderCtrlState.isInitialized &&
      accountAdderCtrlState.type === 'internal' &&
      accountAdderCtrlState.subType === 'seed'
    ) {
      navigate(WEB_ROUTES.accountAdder, { state: { hideBack: true } })
    }
  }, [
    accountAdderCtrlState.isInitialized,
    accountAdderCtrlState.subType,
    accountAdderCtrlState.type,
    navigate
  ])

  const handleAuthButtonPress = useCallback(
    async (flow: 'create-new-account' | 'import-existing-account' | 'view-only') => {
      if (flow === 'create-new-account') {
        goToNextRoute('createNewAccount')
        return
      }
      if (flow === 'import-existing-account') {
        goToNextRoute('importExistingAccount')
        return
      }
      if (flow === 'view-only') {
        goToNextRoute('watchAddress')
      }
    },
    [goToNextRoute]
  )

  const panelWidthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_WIDTH * 0.25, CARD_WIDTH],
    extrapolate: 'clamp'
  })

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <Animated.View style={{ opacity: opacityInterpolate }}>
          <Header withAmbireLogo />
        </Animated.View>
      }
    >
      <TabLayoutWrapperMainContent>
        <View>
          <Animated.View
            style={[
              panelStyles.container,
              common.shadowTertiary,
              {
                zIndex: -1,
                overflow: 'hidden',
                alignSelf: 'center',
                width: panelWidthInterpolate
              }
            ]}
          >
            <Panel
              isAnimated
              spacingsSize="small"
              style={{
                minWidth: CARD_WIDTH,
                alignSelf: 'center',
                backgroundColor: 'transparent',
                opacity: opacityInterpolate as any,
                borderWidth: 0
              }}
            >
              <View style={[flexbox.justifySpaceBetween]}>
                <View
                  style={[flexbox.justifyCenter, flexbox.alignCenter, flexbox.flex1, spacings.mbSm]}
                >
                  <AmbireLogo height={96} />
                  <Text
                    style={[spacings.mtLg, text.center]}
                    weight="medium"
                    appearance="secondaryText"
                  >
                    {t('The Web3 wallet that makes self-custody easy and secure.')}
                  </Text>
                </View>
                <View style={[flexbox.justifySpaceBetween, spacings.mt3Xl]}>
                  <Button
                    type="primary"
                    text={t('Create New Account')}
                    onPress={() => handleAuthButtonPress('create-new-account')}
                  />
                  <Button
                    type="secondary"
                    text={t('Import Existing Account')}
                    onPress={() => handleAuthButtonPress('import-existing-account')}
                  />
                  <Button
                    type="ghost"
                    hasBottomSpacing={false}
                    onPress={() => handleAuthButtonPress('view-only')}
                  >
                    <>
                      <Text appearance="primary">{t('Watch an Address')}</Text>
                      <ViewModeIcon color={theme.primary} height={16} />
                    </>
                  </Button>
                </View>
              </View>
            </Panel>
          </Animated.View>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(GetStartedScreen)
