import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import EmailRecoveryIcon from '@common/assets/svg/EmailRecoveryIcon'
import ImportFromDefaultOrExternalSeedIcon from '@common/assets/svg/ImportFromDefaultOrExternalSeedIcon'
import ImportJsonIcon from '@common/assets/svg/ImportJsonIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import BottomSheet from '@common/components/BottomSheet'
import Checkbox from '@common/components/Checkbox'
import DualChoiceModal from '@common/components/DualChoiceModal'
import DualChoiceWarningModal from '@common/components/DualChoiceWarningModal'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'
import { showEmailVaultInterest } from '@web/modules/auth/utils/emailVault'
import { getExtensionInstanceId } from '@web/utils/analytics'

import getStyles from './style'

const HotWalletImportSelectorScreen = () => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { navigate } = useNavigation()
  const { isReadyToStoreKeys, hasKeystoreSavedSeed, keyStoreUid } = useKeystoreControllerState()
  const { addToast } = useToast()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const {
    ref: privateKeySheetRef,
    open: openPrivateKeyBottomSheet,
    close: closePrivateKeyBottomSheet
  } = useModalize()
  const { accounts } = useAccountsControllerState()
  const accountAdderCtrlState = useAccountAdderControllerState()
  const [isWarning1Checked, setIsWarning1Checked] = useState(false)
  const [isWarning2Checked, setIsWarning2Checked] = useState(false)

  useEffect(() => {
    if (
      accountAdderCtrlState.isInitialized &&
      // The AccountAdder could have been already initialized with the same or a
      // different type. Navigate immediately only if the types match.
      accountAdderCtrlState.type === 'internal' &&
      accountAdderCtrlState.subType === 'seed'
    ) {
      navigate(WEB_ROUTES.accountAdder)
    }
  }, [
    accountAdderCtrlState.isInitialized,
    accountAdderCtrlState.subType,
    accountAdderCtrlState.type,
    navigate
  ])

  const handleImportFromExternalSeed = useCallback(() => {
    navigate(WEB_ROUTES.importSeedPhrase)
  }, [navigate])

  const handleImportSeed = useCallback(() => {
    if (!isReadyToStoreKeys) {
      navigate(WEB_ROUTES.keyStoreSetup, {
        state: { flow: hasKeystoreSavedSeed ? 'seed' : 'seed-with-option-to-save' }
      })
      return
    }

    navigate(WEB_ROUTES.importSeedPhrase)
  }, [navigate, isReadyToStoreKeys, hasKeystoreSavedSeed])

  const handleCreateSeed = useCallback(() => {
    if (!isReadyToStoreKeys) {
      navigate(WEB_ROUTES.keyStoreSetup, { state: { flow: 'create-seed' } })
      return
    }

    navigate(WEB_ROUTES.createSeedPhrasePrepare)
  }, [navigate, isReadyToStoreKeys])

  const isImportOnly = hasKeystoreSavedSeed || accounts.length
  const onOptionPress = useCallback(
    async (flow: string) => {
      if (flow === 'seed') {
        // if the extension has already been init once, this option
        // will allow import a seed only as it will be availableo only
        // from the bottom sheet
        if (isImportOnly) {
          // if you've added a view only account / hardware wallet,
          // you won't have a device password => check it
          if (!isReadyToStoreKeys) {
            navigate(WEB_ROUTES.keyStoreSetup, { state: { flow: 'seed' } })
            return
          }

          handleImportFromExternalSeed()
          return
        }

        openBottomSheet()
        return
      }

      if (flow === 'email') {
        await showEmailVaultInterest(getExtensionInstanceId(keyStoreUid), accounts.length, addToast)
        return
      }
      if (flow === 'private-key') {
        openPrivateKeyBottomSheet()
        return
      }

      if (!isReadyToStoreKeys) {
        navigate(WEB_ROUTES.keyStoreSetup, { state: { flow } })
        return
      }

      if (flow === 'import-json') {
        navigate(WEB_ROUTES.importSmartAccountJson)
      }

      // @TODO: Implement email vault
    },
    [
      accounts.length,
      addToast,
      handleImportFromExternalSeed,
      isImportOnly,
      isReadyToStoreKeys,
      keyStoreUid,
      navigate,
      openBottomSheet,
      openPrivateKeyBottomSheet
    ]
  )

  const closePrivateKeyBottomSheetWrapped = useCallback(() => {
    setIsWarning1Checked(false)
    setIsWarning2Checked(false)
    closePrivateKeyBottomSheet()
  }, [closePrivateKeyBottomSheet])

  const handlePrivateKeyBottomSheetProceed = useCallback(() => {
    if (!isReadyToStoreKeys) {
      navigate(WEB_ROUTES.keyStoreSetup, { state: { flow: 'private-key' } })
      return
    }
    navigate(WEB_ROUTES.importPrivateKey)
  }, [isReadyToStoreKeys, navigate])

  const options = [
    {
      testID: 'button-proceed-seed-phrase',
      title: 'Seed Phrase (Basic & Smart Accounts)',
      text: isImportOnly
        ? 'Import existing Basic (EOA) or Smart Account(s) with a seed phrase.'
        : 'Create a new seed phrase or import an existing one to add account(s) or securely unlock new Basic (EOA) or Smart Account(s).',
      image: SeedPhraseIcon,
      buttonText: 'Proceed',
      flow: 'seed'
    },
    {
      testID: 'button-import-private-key',
      title: 'Private Key\n(Basic Accounts)',
      text: 'Import an existing Basic Account (EOA) with a private key.',
      image: PrivateKeyIcon,
      buttonText: 'Import',
      flow: 'private-key'
    },
    {
      testID: 'button-import-json',
      title: 'JSON Backup\n(Smart Accounts)',
      text: (
        <View>
          <Text style={[spacings.mbTy]} fontSize={14} appearance="secondaryText">
            Restore a Smart Account{' '}
            <Text weight="semiBold" fontSize={14}>
              created in the Ambire extension
            </Text>{' '}
            via a JSON backup file.
          </Text>
          <Alert type="warning">
            <Text fontSize={14} appearance="secondaryText">
              Backups from the web and app wallets cannot be imported into the extension.
            </Text>
          </Alert>
        </View>
      ),
      image: ImportJsonIcon,
      buttonText: 'Import',
      flow: 'import-json'
    }
  ]

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
      footer={<BackButton fallbackBackRoute={WEB_ROUTES.dashboard} />}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Select an option')}>
          <View style={[flexbox.directionRow]}>
            {options.map((option) => (
              <Card
                testID={option.testID}
                style={[flexbox.flex1, spacings.mr]}
                key={option.title}
                title={option.title}
                text={option.text}
                icon={option.image}
                onPress={() => onOptionPress(option.flow)}
                buttonText={option.buttonText}
                titleStyle={[spacings.mb]}
              />
            ))}
            {/* the email vault option is fairly different than the others */}
            {/* therefore, we hardcode it here */}
            <Card
              title={t('Email-Based Account')}
              style={[flexbox.flex1]}
              icon={EmailRecoveryIcon}
              buttonText={t('Sign me up')}
              onPress={() => onOptionPress('email')}
              isPartiallyDisabled
              titleStyle={[spacings.mb2Xl]}
              isSecondary
            >
              <Alert
                title=""
                type="info"
                text="Email-based accounts are in the pipeline. Let us know if you want to see this feature sooner."
                style={spacings.mbSm}
              />
            </Card>
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>

      <BottomSheet
        id="import-private-key-warning"
        sheetRef={privateKeySheetRef}
        closeBottomSheet={closePrivateKeyBottomSheetWrapped}
        backgroundColor="secondaryBackground"
        style={styles.warningModal}
      >
        <DualChoiceWarningModal
          title={t('Dangers of importing a Private Key')}
          Icon={ImportFromDefaultOrExternalSeedIcon}
          onPrimaryButtonPress={handlePrivateKeyBottomSheetProceed}
          onSecondaryButtonPress={closePrivateKeyBottomSheetWrapped}
          secondaryButtonText={t('Cancel')}
          primaryButtonText={t('Proceed')}
          primaryButtonProps={{
            disabled: !isWarning1Checked || !isWarning2Checked,
            testID: 'proceed-btn'
          }}
        >
          <View style={spacings.mbSm}>
            <Checkbox
              testID="private-key-warning-checkbox-1"
              label={t(
                'I understand that this private key cannot be tied to the main seed phrase and therefore it cannot be recovered using your main seed phrase. I am responsible of safekeeping this private key separately, as it cannot be recovered using the built-in Ambire methods.'
              )}
              labelProps={{ fontSize: 14 }}
              value={isWarning1Checked}
              onValueChange={setIsWarning1Checked}
            />
            <Checkbox
              testID="private-key-warning-checkbox-2"
              label={t(
                'I understand that I can only import a Basic Account (EOA) from this private key.'
              )}
              labelProps={{ fontSize: 14 }}
              value={isWarning2Checked}
              onValueChange={setIsWarning2Checked}
            />
          </View>
          <Alert
            type="info"
            title={t(
              'Pro tip: to import a Smart Account, you can use a hardware wallet, an existing seed phrase or a new seed phrase.'
            )}
            size="sm"
          />
        </DualChoiceWarningModal>
      </BottomSheet>

      <BottomSheet
        id="create-or-import-seed-phrase"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        backgroundColor="secondaryBackground"
        style={{ overflow: 'hidden', width: 632, ...spacings.ph0, ...spacings.pv0 }}
        type="modal"
      >
        <DualChoiceModal
          title={t('Create or import a seed phrase')}
          description={
            <View>
              <Text style={spacings.mbTy} appearance="secondaryText">
                {t('If you have a seed phrase you want to import, select Import seed.')}
              </Text>
              <Text appearance="secondaryText">
                {t('Alternatively, to create a new one, proceed with Create seed.')}
              </Text>
            </View>
          }
          Icon={ImportFromDefaultOrExternalSeedIcon}
          onSecondaryButtonPress={handleImportSeed}
          onPrimaryButtonPress={handleCreateSeed}
          secondaryButtonText={t('Import seed')}
          secondaryButtonTestID="import-existing-seed-btn"
          primaryButtonText={t('Create seed')}
          primaryButtonTestID="create-seed-btn"
        />
      </BottomSheet>
    </TabLayoutContainer>
  )
}

export default React.memo(HotWalletImportSelectorScreen)
