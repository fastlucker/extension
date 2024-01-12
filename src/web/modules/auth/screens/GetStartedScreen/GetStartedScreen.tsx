import React, { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import CreateWalletIcon from '@common/assets/svg/CreateWalletIcon'
import EmailRecoveryIcon from '@common/assets/svg/EmailRecoveryIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import SeedPhraseRecoveryIcon from '@common/assets/svg/SeedPhraseRecoveryIcon'
import ViewOnlyIcon from '@common/assets/svg/ViewOnlyIcon'
import Modal from '@common/components/Modal'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'

import getStyles from './styles'

const GetStartedScreen = () => {
  const { theme } = useTheme(getStyles)
  const { t } = useTranslation()
  const keystoreState = useKeystoreControllerState()
  const { navigate } = useNavigation()
  const wrapperRef: any = useRef(null)
  const [isNewHotWalletModalOpen, setIsNewHotWalletModalOpen] = useState(false)

  const handleAuthButtonPress = useCallback(
    async (flow: 'email' | 'hw' | 'import-hot-wallet' | 'new-hot-wallet' | 'view-only') => {
      const hasTerms = await storage.get('termsState', false)

      if (flow === 'new-hot-wallet') {
        setIsNewHotWalletModalOpen(true)
        return
      }
      if (flow === 'import-hot-wallet') {
        navigate(WEB_ROUTES.importHotWallet)
        return
      }
      if (!hasTerms) {
        navigate(WEB_ROUTES.terms, { state: { flow } })
        return
      }
      if (flow === 'view-only') {
        navigate(WEB_ROUTES.viewOnlyAccountAdder)
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

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
    >
      <Modal
        modalStyle={{
          alignItems: 'flex-start',
          minWidth: 'initial',
          ...spacings.pbXl,
          ...spacings.phXl,
          ...spacings.pbLg
        }}
        onClose={() => setIsNewHotWalletModalOpen(false)}
        isOpen={isNewHotWalletModalOpen}
        hideLeftSideContainer
        title={t('Select the recovery option of your new wallet')}
      >
        <View style={[flexboxStyles.directionRow]}>
          <Card
            title={t('Set up with an email')}
            text={t(
              'This option lets you quickly and easily open a secure Smart Account wallet with just an email. It also allows you to recover your account with your email. Learn more'
            )}
            style={flexboxStyles.flex1}
            icon={EmailRecoveryIcon}
            buttonText={t('Proceed')}
            isDisabled
          />
          <Card
            title={t('Set up with a Seed Phrase')}
            style={{
              ...flexboxStyles.flex1,
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
        <Panel title={t('Select one of the following options')} style={spacings.mbMd}>
          <View style={[flexboxStyles.directionRow]}>
            <Card
              title={t('Connect a\nHardware Wallet')}
              text={t(
                'Start using accounts secured by Trezor, Ledger, or another Hardware Wallet.'
              )}
              style={flexboxStyles.flex1}
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
                ...flexboxStyles.flex1,
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
              style={{ ...flexboxStyles.flex1, ...spacings.mr }}
              onPress={() => handleAuthButtonPress('new-hot-wallet')}
              buttonText={t('Create')}
            />
            <Card
              title={t('Watch an\naddress')}
              text={t(
                'Import an address in View-only mode to see its balance and simulate transactions.'
              )}
              icon={ViewOnlyIcon}
              style={flexboxStyles.flex1}
              onPress={() => handleAuthButtonPress('view-only')}
              buttonText={t('Add')}
              isSecondary
            />
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default GetStartedScreen
