import { View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import VerifyInviteCodeForm from '@web/modules/invite/components/VerifyInviteCodeForm'

const InviteVerifyScreen = () => {
  const { t } = useTranslation()

  // TODO: Invite verification flow
  return (
    <TabLayoutContainer
      width="md"
      header={
        <View style={[flexbox.alignCenter, spacings.mtLg]}>
          <AmbireLogo width={185} height={92} />
          <Text fontSize={32} weight="regular" style={[{ textAlign: 'center' }, spacings.mbXl]}>
            {t('Ambire Invite Verification')}
          </Text>
        </View>
      }
    >
      <TabLayoutWrapperMainContent
        showsVerticalScrollIndicator
        style={spacings.mbLg}
        contentContainerStyle={{ ...spacings.ph2Xl, ...spacings.pt0 }}
      >
        <VerifyInviteCodeForm />
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default InviteVerifyScreen
