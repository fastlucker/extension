import { View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import AmbireLogoWithTextMonochrome from '@common/assets/svg/AmbireLogoWithTextMonochrome'
import UnlockScreenBackground from '@common/assets/svg/UnlockScreenBackground'
import SeparatorWithText from '@common/components/SeparatorWithText'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import VerifyInviteCodeForm from '@web/modules/invite/components/VerifyInviteCodeForm'

import getStyles from './style'

const InviteVerifyScreen = () => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)

  // TODO: Invite verification flow
  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <>
          <Title style={styles.title} hasBottomSpacing={false}>
            {t('Referral Invite')}
          </Title>
          <View style={styles.headerContainer}>
            <AmbireLogoWithTextMonochrome width={115} height={120} />
            <View style={styles.backgroundSVG}>
              <UnlockScreenBackground width={400} height={240} />
            </View>
          </View>
        </>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mb0} contentContainerStyle={spacings.pt0}>
        <View style={styles.container}>
          <VerifyInviteCodeForm />
          <SeparatorWithText text={t("Don't have one?")} />
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default InviteVerifyScreen
