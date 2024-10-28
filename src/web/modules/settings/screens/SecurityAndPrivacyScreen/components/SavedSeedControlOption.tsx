import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'
import Button from '@common/components/Button'
import ControlOption from '@common/components/ControlOption'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

const SavedSeedControlOption = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate } = useNavigation()
  const keystoreState = useKeystoreControllerState()

  const goToSavedSeed = useCallback(() => {
    navigate(ROUTES.savedSeed)
  }, [navigate])

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
    </ControlOption>
  )
}

export default React.memo(SavedSeedControlOption)
