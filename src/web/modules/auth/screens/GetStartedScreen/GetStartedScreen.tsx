import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import CreateWalletIcon from '@common/assets/svg/CreateWalletIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import ViewOnlyIcon from '@common/assets/svg/ViewOnlyIcon'
import BottomSheet from '@common/components/BottomSheet'
import ModalHeader from '@common/components/BottomSheet/ModalHeader'
import Panel from '@common/components/Panel'
import getPanelStyles from '@common/components/Panel/styles'
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
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useWalletStateController from '@web/hooks/useWalletStateController'
import Card from '@web/modules/auth/components/Card'
import Stories from '@web/modules/auth/components/Stories'
import { STORY_CARD_WIDTH } from '@web/modules/auth/components/Stories/styles'
import { TERMS_VERSION } from '@web/modules/terms/screens/Terms'

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
  const keystoreState = useKeystoreControllerState()
  const { accounts } = useAccountsControllerState()
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
        await showEmailVaultInterest(accounts.length, addToast)
        return
      }
      if (!keystoreState.isReadyToStoreKeys && flow !== 'hw') {
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
    [keystoreState.isReadyToStoreKeys, openHotWalletModal, navigate, accounts.length, addToast]
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
              title={t('Select one of the following options')}
              style={{
                backgroundColor: 'transparent',
                opacity: opacityInterpolate as any,
                borderWidth: 0
              }}
            >
              <View style={[flexbox.directionRow]}>
                <Card
                  title={t('Connect a\nHardware Wallet')}
                  text={t(
                    'Start using accounts secured by Trezor, Ledger, or another Hardware Wallet.'
                  )}
                  style={flexbox.flex1}
                  icon={HWIcon}
                  iconProps={{
                    width: 60,
                    height: 60,
                    strokeWidth: 1.25
                  }}
                  buttonText={t('Connect')}
                  onPress={() => handleAuthButtonPress('hw')}
                />
                <Card
                  testID="get-started-button-import"
                  title={t('Import an existing\nhot wallet')}
                  style={{
                    ...flexbox.flex1,
                    ...spacings.mh
                  }}
                  text={t(
                    'Securely import an existing wallet from a seed phrase, private key, or with an email vault.'
                  )}
                  icon={ImportAccountIcon}
                  iconProps={{
                    width: 60,
                    height: 60,
                    strokeWidth: 1.1
                  }}
                  buttonText={t('Import')}
                  onPress={() => handleAuthButtonPress('import-hot-wallet')}
                />
                <Card
                  title={t('Create a new\nhot wallet')}
                  text={t(
                    'Create a fresh hot wallet with modern features, including optional smart recovery.'
                  )}
                  icon={CreateWalletIcon}
                  iconProps={{
                    width: 60,
                    height: 60,
                    strokeWidth: 1.1
                  }}
                  style={{ ...flexbox.flex1, ...spacings.mr }}
                  onPress={() => handleAuthButtonPress('create-hot-wallet')}
                  buttonText={t('Create')}
                />
                <Card
                  testID="get-started-button-add"
                  title={t('Watch an\naddress')}
                  text={t(
                    'Import an address in view-only mode to see its balance and simulate transactions.'
                  )}
                  icon={ViewOnlyIcon}
                  style={flexbox.flex1}
                  onPress={() => handleAuthButtonPress('view-only')}
                  buttonText={t('Add')}
                  isSecondary
                />
              </View>
            </Panel>
          </View>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(GetStartedScreen)
