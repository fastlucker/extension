import HWIcon from '@common/assets/svg/HWIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'

const getAddKeyOptions = ({
  navigate,
  t
}: {
  navigate: ReturnType<typeof useNavigation>['navigate']
  t: (str: string) => string
}) => {
  return [
    {
      key: 'hw',
      text: t('Connect a Hardware Wallet'),
      icon: HWIcon,
      onPress: () => navigate(ROUTES.hardwareWalletSelect)
    },
    {
      key: 'private-key',
      text: t('Private Key'),
      icon: PrivateKeyIcon,
      onPress: () => navigate(ROUTES.importPrivateKey),
      iconProps: {
        width: 36,
        height: 36
      }
    },
    {
      key: 'seed-phrase',
      text: t('Seed Phrase'),
      icon: SeedPhraseIcon,
      onPress: () => navigate(ROUTES.importSeedPhrase),
      iconProps: {
        width: 36,
        height: 36
      }
    }
  ]
}

export { getAddKeyOptions }
