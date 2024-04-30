import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'

const InviteVerifyScreen = () => {
  const { t } = useTranslation()

  // TODO: Invite verification flow
  return <Text>{t('Verify your Ambire invitation')}</Text>
}

export default InviteVerifyScreen
