import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import ViewModeIcon from '@common/assets/svg/ViewModeIcon'
import BottomSheet from '@common/components/BottomSheet'
import ModalHeader from '@common/components/BottomSheet/ModalHeader'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import getPanelStyles from '@common/components/Panel/styles'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import Header from '@common/modules/header/components/Header'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useWalletStateController from '@web/hooks/useWalletStateController'
import Stories from '@web/modules/auth/components/Stories'
import { STORY_CARD_WIDTH } from '@web/modules/auth/components/Stories/styles'
import { TERMS_VERSION } from '@web/modules/terms/screens/Terms'
import { getExtensionInstanceId } from '@web/utils/analytics'

import HotWalletCreateCards from '../../components/HotWalletCreateCards'
import { ONBOARDING_VERSION } from '../../components/Stories/Stories'
import { showEmailVaultInterest } from '../../utils/emailVault'
import getStyles from './styles'

const GetStartedScreen = () => {
  const { theme } = useTheme(getStyles)
  const { styles: panelStyles } = useTheme(getPanelStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { addToast } = useToast()
  const { isReadyToStoreKeys, keyStoreUid } = useKeystoreControllerState()
  const { accounts } = useAccountsControllerState()
  const accountAdderCtrlState = useAccountAdderControllerState()
  const {
    ref: hotWalletModalRef,
    open: openHotWalletModal,
    close: closeHotWalletModal
  } = useModalize()
  const wrapperRef: any = useRef(null)
  const animation = useRef(new Animated.Value(0)).current
  const { width } = useWindowSize()
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
    if (state.onboardingState) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 480,
        useNativeDriver: false
      }).start()
    }
  }, [animation, state.onboardingState])

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
    async (
      flow: 'email' | 'hw' | 'import-hot-wallet' | 'create-seed' | 'create-hot-wallet' | 'view-only'
    ) => {
      if (flow === 'create-hot-wallet') {
        openHotWalletModal()
        return
      }
      if (flow === 'view-only') {
        navigate(WEB_ROUTES.viewOnlyAccountAdder)
        return
      }
      if (flow === 'import-hot-wallet') {
        navigate(WEB_ROUTES.importHotWallet)
        return
      }
      if (flow === 'email') {
        await showEmailVaultInterest(getExtensionInstanceId(keyStoreUid), accounts.length, addToast)
        return
      }
      if (!isReadyToStoreKeys && flow !== 'hw') {
        navigate(WEB_ROUTES.keyStoreSetup, { state: { flow } })
        return
      }
      if (flow === 'hw') {
        navigate(WEB_ROUTES.hardwareWalletSelect)
        return
      }
      if (flow === 'create-seed') {
        navigate(WEB_ROUTES.createSeedPhrasePrepare)
      }
    },
    [isReadyToStoreKeys, openHotWalletModal, navigate, keyStoreUid, accounts.length, addToast]
  )

  const handleSetStoriesCompleted = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    storage
      .set('termsState', {
        version: TERMS_VERSION,
        acceptedAt: Date.now()
      })
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatch({
          type: 'SET_ONBOARDING_STATE',
          params: { version: ONBOARDING_VERSION, viewedAt: Date.now() }
        })
      })
  }

  const panelWidthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [`${Math.min((STORY_CARD_WIDTH / (width || 0)) * 100, 100)}%`, '100%'],
    extrapolate: 'clamp'
  })

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 1],
    extrapolate: 'clamp'
  })

  return (
    <TabLayoutContainer
      style={{ width: 400 }}
      backgroundColor={theme.secondaryBackground}
      header={
        <Animated.View style={{ opacity: opacityInterpolate }}>
          <Header withAmbireLogo />
        </Animated.View>
      }
    >
      <BottomSheet
        id="hot-wallet-modal"
        autoWidth
        closeBottomSheet={closeHotWalletModal}
        backgroundColor="primaryBackground"
        sheetRef={hotWalletModalRef}
      >
        <ModalHeader
          hideLeftSideContainer
          title={t('Select the recovery option of your new wallet')}
        />
        <HotWalletCreateCards
          handleEmailPress={() => handleAuthButtonPress('email')}
          handleSeedPress={() => handleAuthButtonPress('create-seed')}
        />
      </BottomSheet>
      <TabLayoutWrapperMainContent wrapperRef={wrapperRef} contentContainerStyle={spacings.mbLg}>
        {!state.onboardingState && <Stories onComplete={handleSetStoriesCompleted} />}
        {!!state.onboardingState && (
          <View>
            <Animated.View
              style={[
                panelStyles.container,
                {
                  zIndex: -1,
                  position: 'absolute',
                  alignSelf: 'center',
                  height: '100%',
                  width: panelWidthInterpolate
                }
              ]}
            />
            <Panel
              isAnimated
              style={{
                backgroundColor: 'transparent',
                opacity: opacityInterpolate as any,
                borderWidth: 0,
                ...spacings.ptXl,
                ...spacings.phLg,
                ...spacings.pb0
              }}
            >
              <View style={[flexbox.justifySpaceBetween]}>
                <View
                  style={[flexbox.justifyCenter, flexbox.alignCenter, flexbox.flex1, spacings.mbSm]}
                >
                  <AmbireLogo height={96} />
                  <Text style={[spacings.mtLg, { textAlign: 'center' }]} appearance="secondaryText">
                    The Web3 wallet that makes self-custody easy and secure.
                  </Text>
                </View>
                <View style={[flexbox.justifySpaceBetween, spacings.mt3Xl]}>
                  <Button type="primary" text={t('Create New Account')} />
                  <Button type="secondary" text={t('Import Existing Account')} />
                  <Button type="ghost" onPress={() => handleAuthButtonPress('view-only')}>
                    <>
                      <Text appearance="primary">{t('Watch an Address')}</Text>
                      <ViewModeIcon color={theme.primary} height={16} />
                    </>
                  </Button>
                </View>
              </View>
            </Panel>
          </View>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(GetStartedScreen)
