import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'
import Button from '@common/components/Button'
import ControlOption from '@common/components/ControlOption'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

const SavedSeedControlOption = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate } = useNavigation()
  const keystoreState = useKeystoreControllerState()

  const goToSavedSeed = useCallback(() => {
    navigate(WEB_ROUTES.savedSeed)
  }, [navigate])

  const goToCreateSeed = useCallback(() => {
    keystoreState.isReadyToStoreKeys
      ? navigate(WEB_ROUTES.createSeedPhrasePrepare)
      : navigate(WEB_ROUTES.keyStoreSetup, { state: { flow: 'create-seed' } })
  }, [navigate, keystoreState.isReadyToStoreKeys])

  const goToImportSeed = useCallback(() => {
    keystoreState.isReadyToStoreKeys
      ? navigate(WEB_ROUTES.importSeedPhrase)
      : navigate(WEB_ROUTES.keyStoreSetup, { state: { flow: 'seed' } })
  }, [navigate, keystoreState.isReadyToStoreKeys])

  return (
    <ControlOption
      style={spacings.mbTy}
      title={t('Saved seed')}
      description={
        keystoreState.hasKeystoreSavedSeed
          ? t('Reveal the saved seed in the Ambire Wallet extension.')
          : t("Currently, you don't have a saved seed in the extension.")
      }
      renderIcon={<SeedPhraseIcon width={25} color={theme.primaryText} />}
    >
      {keystoreState.hasKeystoreSavedSeed ? (
        <Button
          testID="show-saved-seed-button"
          size="small"
          hasBottomSpacing={false}
          style={{
            width: 80
          }}
          text={t('Manage')}
          disabled={!keystoreState.hasKeystoreSavedSeed}
          onPress={goToSavedSeed}
        />
      ) : (
        <>
          <Button
            testID="create-saved-seed-button"
            size="small"
            hasBottomSpacing={false}
            style={{
              width: 80
            }}
            text={t('Create')}
            onPress={goToCreateSeed}
          />
          <Button
            type="outline"
            testID="import-seed-button"
            size="small"
            hasBottomSpacing={false}
            style={[
              {
                width: 80
              },
              spacings.mlTy
            ]}
            text={t('Import')}
            onPress={goToImportSeed}
          />
        </>
      )}
    </ControlOption>
  )
}

export default React.memo(SavedSeedControlOption)
