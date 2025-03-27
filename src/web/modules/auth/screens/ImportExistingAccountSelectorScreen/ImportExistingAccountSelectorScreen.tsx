import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'

import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import getPanelStyles from '@common/components/Panel/styles'
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
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useWalletStateController from '@web/hooks/useWalletStateController'

import getStyles from './styles'

export const CARD_WIDTH = 400

const ImportExistingAccountSelectorScreen = () => {
  const { theme } = useTheme(getStyles)
  const { styles: panelStyles } = useTheme(getPanelStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  const wrapperRef: any = useRef(null)
  const animation = useRef(new Animated.Value(0)).current
  const { authStatus } = useAuth()
  const { dispatch } = useBackgroundService()

  const state = useWalletStateController()
  const { goToPrevRoute } = useOnboardingNavigation()
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

  const handleAuthButtonPress = useCallback(
    async (flow: 'create-new-account' | 'import-existing-account' | 'view-only') => {
      if (flow === 'create-new-account') {
        navigate(WEB_ROUTES.createSeedPhrasePrepare)
        return
      }
      if (flow === 'import-existing-account') {
        navigate(WEB_ROUTES.importExistingAccount)
        return
      }
      if (flow === 'view-only') {
        navigate(WEB_ROUTES.viewOnlyAccountAdder)
      }
    },
    [navigate]
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
      <TabLayoutWrapperMainContent wrapperRef={wrapperRef} contentContainerStyle={spacings.mbLg}>
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
              withBackButton
              onBackButtonPress={goToPrevRoute}
              title={t('Select Import Method')}
              style={{
                minWidth: CARD_WIDTH,
                alignSelf: 'center',
                backgroundColor: 'transparent',
                opacity: opacityInterpolate as any,
                borderWidth: 0
              }}
            >
              <View style={[flexbox.justifySpaceBetween]}>
                <Button type="primary" text={t('sdfsdfsdf')} />
                <Button type="secondary" text={t('sdfsfs')} />
              </View>
            </Panel>
          </Animated.View>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(ImportExistingAccountSelectorScreen)
