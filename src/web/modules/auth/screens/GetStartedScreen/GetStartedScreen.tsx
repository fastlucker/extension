import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, View } from 'react-native'

import CreateWalletIcon from '@common/assets/svg/CreateWalletIcon'
import EmailRecoveryIcon from '@common/assets/svg/EmailRecoveryIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import SeedPhraseRecoveryIcon from '@common/assets/svg/SeedPhraseRecoveryIcon'
import ViewOnlyIcon from '@common/assets/svg/ViewOnlyIcon'
import Modal from '@common/components/Modal'
import Panel from '@common/components/Panel'
import getPanelStyles from '@common/components/Panel/styles'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import Card from '@web/modules/auth/components/Card'

import Stories from '../../components/Stories/Stories'
import { STORY_CARD_WIDTH } from '../../components/Stories/styles'
import getStyles from './styles'

const GetStartedScreen = () => {
  const { theme } = useTheme(getStyles)
  const { styles: panelStyles } = useTheme(getPanelStyles)
  const { t } = useTranslation()
  const keystoreState = useKeystoreControllerState()
  const mainState = useMainControllerState()
  const { navigate } = useNavigation()
  const wrapperRef: any = useRef(null)
  const [storiesCompleted, setStoriesCompleted] = useState<boolean | undefined>(undefined)
  const [isCreateHotWalletModalOpen, setIsCreateHotWalletModalOpen] = useState(false)
  const animation = useRef(new Animated.Value(0)).current
  const { width } = useWindowSize()
  useEffect(() => {
    setStoriesCompleted(!!mainState.accounts.length)
  }, [mainState.accounts.length])

  const handleAuthButtonPress = useCallback(
    async (flow: 'email' | 'hw' | 'import-hot-wallet' | 'create-hot-wallet' | 'view-only') => {
      if (flow === 'create-hot-wallet') {
        setIsCreateHotWalletModalOpen(true)
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
      if (!keystoreState.isReadyToStoreKeys && flow !== 'hw') {
        navigate(WEB_ROUTES.keyStoreSetup, { state: { flow } })
        return
      }
      if (flow === 'email') {
        navigate(WEB_ROUTES.createEmailVault)
        return
      }
      if (flow === 'hw') {
        navigate(WEB_ROUTES.hardwareWalletSelect)
      }
    },
    [navigate, keystoreState]
  )

  const handleSetStoriesCompleted = () => {
    setStoriesCompleted(true)
    Animated.timing(animation, {
      toValue: 1,
      duration: 480,
      useNativeDriver: false
    }).start()
  }

  if (storiesCompleted === undefined) return null

  const panelWidthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [`${Math.min((STORY_CARD_WIDTH / (width || 0)) * 100, 100)}%`, '100%'],
    extrapolate: 'clamp'
  })

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.4, 1],
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
      <Modal
        modalStyle={{
          alignItems: 'flex-start',
          minWidth: 'initial',
          ...spacings.pbXl,
          ...spacings.phXl,
          ...spacings.pbLg
        }}
        onClose={() => setIsCreateHotWalletModalOpen(false)}
        isOpen={isCreateHotWalletModalOpen}
        hideLeftSideContainer
        title={t('Select the recovery option of your new wallet')}
      >
        <View style={[flexbox.directionRow]}>
          <Card
            title={t('Set up with an email')}
            text={t(
              'This option lets you quickly and easily open a secure Smart Account wallet with just an email. It also allows you to recover your account with your email. Learn more'
            )}
            style={flexbox.flex1}
            icon={EmailRecoveryIcon}
            buttonText={t('Proceed')}
            isDisabled
          />
          <Card
            title={t('Set up with a Seed Phrase')}
            style={{
              ...flexbox.flex1,
              ...spacings.ml
            }}
            text={t(
              'This option lets you open a secure Smart Account wallet with a traditional 24-word seed phrase. The unique seed phrase allows you to recover your account, but keeping it secret and secure is vital for the account integrity. Learn more'
            )}
            icon={SeedPhraseRecoveryIcon}
            buttonText={t('Proceed')}
            onPress={() => handleAuthButtonPress('todo')}
          />
        </View>
      </Modal>
      <TabLayoutWrapperMainContent wrapperRef={wrapperRef} contentContainerStyle={spacings.mbLg}>
        {!storiesCompleted && <Stories onComplete={handleSetStoriesCompleted} />}
        {!!storiesCompleted && (
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
                  title={t('Import an existing\nhot wallet')}
                  style={{
                    ...flexbox.flex1,
                    ...spacings.mh
                  }}
                  text={t(
                    'Securely import an existing wallet from a Seed Phrase, Private Key, or with an Email Vault.'
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
                  title={t('Watch an\naddress')}
                  text={t(
                    'Import an address in View-only mode to see its balance and simulate transactions.'
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
