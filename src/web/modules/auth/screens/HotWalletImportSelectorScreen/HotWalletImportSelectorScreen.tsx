import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import ImportFromDefaultOrExternalSeedIcon from '@common/assets/svg/ImportFromDefaultOrExternalSeedIcon'
import BackButton from '@common/components/BackButton'
import BottomSheet from '@common/components/BottomSheet'
import DualChoiceModal from '@common/components/DualChoiceModal'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'
import options from '@web/modules/auth/screens/HotWalletImportSelectorScreen/options'

const HotWalletImportSelectorScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate } = useNavigation()
  const { isReadyToStoreKeys, hasKeystoreDefaultSeed } = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const accountAdderCtrlState = useAccountAdderControllerState()
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

  const handleImportFromDefaultSeed = useCallback(() => {
    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_FROM_DEFAULT_SEED_PHRASE' })
  }, [dispatch])

  const handleImportFromExternalSeed = useCallback(() => {
    navigate(WEB_ROUTES.importSeedPhrase)
  }, [navigate])

  const handleImportSeed = useCallback(() => {
    if (!isReadyToStoreKeys) {
      navigate(WEB_ROUTES.keyStoreSetup, { state: { flow: 'seed' } })
      return
    }

    navigate(WEB_ROUTES.importSeedPhrase)
  }, [navigate, isReadyToStoreKeys])

  const handleCreateSeed = useCallback(() => {
    if (!isReadyToStoreKeys) {
      navigate(WEB_ROUTES.keyStoreSetup, { state: { flow: 'create-seed' } })
      return
    }

    navigate(WEB_ROUTES.createSeedPhrasePrepare)
  }, [navigate, isReadyToStoreKeys])

  const onOptionPress = async (flow: string) => {
    if (flow === 'seed') {
      openBottomSheet()
      return
    }

    if (!isReadyToStoreKeys) {
      navigate(WEB_ROUTES.keyStoreSetup, { state: { flow } })
      return
    }
    if (flow === 'private-key') {
      navigate(WEB_ROUTES.importPrivateKey)
    }

    // @TODO: Implement email vault
  }

  return (
    <TabLayoutContainer
      width="lg"
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
      footer={<BackButton fallbackBackRoute={WEB_ROUTES.dashboard} />}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Select one of the following options')}>
          <View style={[flexbox.directionRow]}>
            {options.map((option, index) => (
              <Card
                testID={option.testID}
                style={index === 1 ? spacings.mh : {}}
                key={option.title}
                title={option.title}
                text={option.text}
                icon={option.image}
                onPress={() => onOptionPress(option.flow)}
                buttonText={option.buttonText}
                isDisabled={option?.isDisabled}
              />
            ))}
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
      {hasKeystoreDefaultSeed ? (
        <BottomSheet
          id="import-seed-phrase"
          sheetRef={sheetRef}
          closeBottomSheet={closeBottomSheet}
          backgroundColor="secondaryBackground"
          style={{ overflow: 'hidden', width: 632, ...spacings.ph0, ...spacings.pv0 }}
          type="modal"
        >
          <DualChoiceModal
            title={t('Import from default or external Seed Phrase')}
            description={
              <View>
                <Text style={spacings.mbTy} appearance="secondaryText">
                  {t(
                    'If you use default seed, you will be given the option to import selected accounts from the currently associated seed phase.'
                  )}
                </Text>
                <Text appearance="secondaryText">
                  {t(
                    'If you use external seed, you can import selected accounts from a seed phrase that you enter now. The seed phase itself won’t be persisted.'
                  )}
                </Text>
              </View>
            }
            Icon={ImportFromDefaultOrExternalSeedIcon}
            onSecondaryButtonPress={handleImportFromExternalSeed}
            onPrimaryButtonPress={handleImportFromDefaultSeed}
            secondaryButtonText={t('Use external seed')}
            primaryButtonText={t('Use default seed')}
          />
        </BottomSheet>
      ) : (
        <BottomSheet
          id="create-or-import-seed-phrase"
          sheetRef={sheetRef}
          closeBottomSheet={closeBottomSheet}
          backgroundColor="secondaryBackground"
          style={{ overflow: 'hidden', width: 632, ...spacings.ph0, ...spacings.pv0 }}
          type="modal"
        >
          <DualChoiceModal
            title={t('Create or import Seed Phrase')}
            description={
              <View>
                <Text style={spacings.mbTy} appearance="secondaryText">
                  {t(
                    'If you already have a seed and you would like to use it, please select the import option'
                  )}
                </Text>
                <Text appearance="secondaryText">
                  {t("If you don't have a seed, select the option to create a new one.")}
                </Text>
              </View>
            }
            Icon={ImportFromDefaultOrExternalSeedIcon}
            onSecondaryButtonPress={handleImportSeed}
            onPrimaryButtonPress={handleCreateSeed}
            secondaryButtonText={t('Import existing seed')}
            primaryButtonText={t('Create seed')}
          />
        </BottomSheet>
      )}
    </TabLayoutContainer>
  )
}

export default React.memo(HotWalletImportSelectorScreen)
