import CreateWalletIcon from '@common/assets/svg/CreateWalletIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import ViewModeIcon from '@common/assets/svg/ViewModeIcon'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import { openInternalPageInTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import { getUiType } from '@web/utils/uiType'

const { isActionWindow } = getUiType()

const useGetAddAccountOptions = ({
  navigate,
  t
}: {
  navigate: ReturnType<typeof useNavigation>['navigate']
  t: (str: string) => string
}) => {
  const navigateWrapped = (route: string) => {
    if (isActionWindow) {
      openInternalPageInTab(route)
      return
    }
    navigate(route)
  }

  const keystoreState = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()

  return [
    {
      key: 'hw',
      text: t('Connect a hardware wallet'),
      icon: HWIcon,
      onPress: () => navigateWrapped(ROUTES.hardwareWalletSelect),
      testID: 'connect-hardware-wallet'
    },
    {
      key: 'hot-wallet',
      text: t('Import an existing hot wallet'),
      icon: ImportAccountIcon,
      onPress: () => navigateWrapped(ROUTES.importHotWallet),
      testID: 'import-existing-wallet'
    },
    {
      key: 'create-wallet',
      text: keystoreState.hasKeystoreMainSeed
        ? t('Import one more account from default seed phrase')
        : t('Create a new hot wallet'),
      icon: CreateWalletIcon,
      onPress: () => {
        if (keystoreState.hasKeystoreMainSeed) {
          dispatch({ type: 'ADD_NEXT_SMART_ACCOUNT_FROM_DEFAULT_SEED_PHRASE' })
        } else {
          navigateWrapped(ROUTES.createHotWallet)
        }
      },
      hasLargerBottomSpace: true,
      testID: 'create-new-wallet'
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
