import CreateWalletIcon from '@common/assets/svg/CreateWalletIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import ImportAccountsFromSeedPhraseIcon from '@common/assets/svg/ImportAccountsFromSeedPhraseIcon'
import ViewModeIcon from '@common/assets/svg/ViewModeIcon'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import { openInternalPageInTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { getUiType } from '@web/utils/uiType'

const { isActionWindow } = getUiType()

const useGetAddAccountOptions = ({
  navigate,
  t,
  hasKeystoreSavedSeed,
  isReadyToStoreKeys
}: {
  navigate: ReturnType<typeof useNavigation>['navigate']
  t: (str: string) => string
  hasKeystoreSavedSeed: boolean
  isReadyToStoreKeys: boolean
}) => {
  const { dispatch } = useBackgroundService()

  const navigateWrapped = (route: string, searchParams = {}) => {
    if (isActionWindow) {
      openInternalPageInTab(route, true, searchParams)
      return
    }
    if (searchParams) {
      navigate(route, { state: searchParams })
      return
    }

    navigate(route)
  }

  const openAccountAdderWithSavedSeed = () => {
    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_FROM_SAVED_SEED_PHRASE' })
  }

  return [
    {
      key: 'hot-wallet',
      text: t('Import existing wallets'),
      icon: ImportAccountIcon,
      onPress: () => navigateWrapped(ROUTES.importHotWallet),
      testID: 'import-existing-wallet'
    },
    {
      key: 'hw',
      text: t('Connect a hardware wallet'),
      icon: HWIcon,
      onPress: () => navigateWrapped(ROUTES.hardwareWalletSelect),
      testID: 'connect-hardware-wallet'
    },
    !hasKeystoreSavedSeed
      ? {
          key: 'create-new-hot-wallet',
          text: t('Create new hot wallets'),
          icon: CreateWalletIcon,
          onPress: () =>
            isReadyToStoreKeys
              ? navigateWrapped(ROUTES.createSeedPhrasePrepare)
              : navigateWrapped(WEB_ROUTES.keyStoreSetup, { flow: 'create-seed' }),
          testID: 'create-new-hot-wallet',
          hasLargerBottomSpace: true
        }
      : {
          key: 'import-from-saved-seed',
          text: t('Import more hot wallets from saved seed'),
          icon: ImportAccountsFromSeedPhraseIcon,
          onPress: () => openAccountAdderWithSavedSeed(),
          testID: 'import-from-saved-seed',
          hasLargerBottomSpace: true
        },
    {
      key: 'view-only',
      text: t('Watch an address'),
      icon: ViewModeIcon,
      onPress: () => navigateWrapped(ROUTES.viewOnlyAccountAdder),
      testID: 'watch-address'
    }
  ]
}

export { useGetAddAccountOptions }
