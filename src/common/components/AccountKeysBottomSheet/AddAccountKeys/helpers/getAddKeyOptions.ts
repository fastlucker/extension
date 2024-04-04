import HWIcon from '@common/assets/svg/HWIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import { openInternalPageInTab } from '@web/extension-services/background/webapi/tab'
import { getUiType } from '@web/utils/uiType'

const { isNotification } = getUiType()

const getAddKeyOptions = ({
  navigate,
  t
}: {
  navigate: ReturnType<typeof useNavigation>['navigate']
  t: (str: string) => string
}) => {
  const navigateWrapped = (route: string) => {
    if (isNotification) {
      openInternalPageInTab(route)
      return
    }
    navigate(route)
  }

  return [
    {
      key: 'hw',
      text: t('Connect a Hardware Wallet'),
      icon: HWIcon,
      onPress: () => navigateWrapped(ROUTES.hardwareWalletSelect)
    },
    {
      key: 'private-key',
      text: t('Private Key'),
      icon: PrivateKeyIcon,
      onPress: () => navigateWrapped(ROUTES.importPrivateKey),
      iconProps: {
        width: 36,
        height: 36
      }
    },
    {
      key: 'seed-phrase',
      text: t('Seed Phrase'),
      icon: SeedPhraseIcon,
      onPress: () => navigateWrapped(ROUTES.importSeedPhrase),
      iconProps: {
        width: 36,
        height: 36
      }
    }
  ]
}

export { getAddKeyOptions }
