import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import ViewModeIcon from '@common/assets/svg/ViewModeIcon'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import { openInternalPageInTab } from '@web/extension-services/background/webapi/tab'
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

  return [
    {
      key: 'hot-wallet',
      text: t('Create new or import existing wallet'),
      icon: ImportAccountIcon,
      onPress: () => navigateWrapped(ROUTES.importHotWallet),
      testID: 'import-existing-wallet'
    },
    {
      key: 'hw',
      text: t('Connect a hardware wallet'),
      icon: HWIcon,
      onPress: () => navigateWrapped(ROUTES.hardwareWalletSelect),
      testID: 'connect-hardware-wallet',
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
