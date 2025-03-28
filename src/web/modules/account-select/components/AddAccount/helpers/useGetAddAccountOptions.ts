import { useTranslation } from 'react-i18next'

import CreateWalletIcon from '@common/assets/svg/CreateWalletIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import ViewModeIcon from '@common/assets/svg/ViewModeIcon'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'

const useGetAddAccountOptions = () => {
  const { goToNextRoute } = useOnboardingNavigation()
  const { t } = useTranslation()

  return [
    {
      key: 'create-new-hot-wallet',
      text: t('Create new hot wallets'),
      icon: CreateWalletIcon,
      onPress: () => goToNextRoute('createNewAccount'),
      testID: 'create-new-hot-wallet'
    },
    {
      key: 'hot-wallet',
      text: t('Import existing accounts'),
      icon: ImportAccountIcon,
      onPress: () => goToNextRoute('importExistingAccount'),
      testID: 'import-existing-wallet'
    },
    {
      key: 'view-only',
      text: t('Watch an address'),
      icon: ViewModeIcon,
      onPress: () => goToNextRoute('watchAddress'),
      testID: 'watch-address'
    }
  ]
}

export { useGetAddAccountOptions }
