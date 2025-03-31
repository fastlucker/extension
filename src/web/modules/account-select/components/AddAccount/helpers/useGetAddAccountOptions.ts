import { useTranslation } from 'react-i18next'

import CreateWalletIcon from '@common/assets/svg/CreateWalletIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import ViewModeIcon from '@common/assets/svg/ViewModeIcon'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'

const useGetAddAccountOptions = () => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()

  return [
    {
      key: 'create-new-hot-wallet',
      text: t('Create new hot wallets'),
      icon: CreateWalletIcon,
      onPress: () => navigate(WEB_ROUTES.createSeedPhrasePrepare),
      testID: 'create-new-hot-wallet'
    },
    {
      key: 'hot-wallet',
      text: t('Import existing accounts'),
      icon: ImportAccountIcon,
      onPress: () => navigate(WEB_ROUTES.importExistingAccount),
      testID: 'import-existing-wallet'
    },
    {
      key: 'view-only',
      text: t('Watch an address'),
      icon: ViewModeIcon,
      onPress: () => navigate(WEB_ROUTES.viewOnlyAccountAdder),
      testID: 'watch-address'
    }
  ]
}

export { useGetAddAccountOptions }
