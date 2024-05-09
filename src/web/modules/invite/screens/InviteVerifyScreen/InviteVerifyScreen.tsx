import React, { useCallback } from 'react'
import { Linking, View } from 'react-native'

import AmbireLogoWithTextMonochrome from '@common/assets/svg/AmbireLogoWithTextMonochrome'
import UnlockScreenBackground from '@common/assets/svg/UnlockScreenBackground'
import SeparatorWithText from '@common/components/SeparatorWithText'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import VerifyInviteCodeForm from '@web/modules/invite/components/VerifyInviteCodeForm'
import { DISCORD_URL, TWITTER_URL } from '@web/modules/router/components/NavMenu/NavMenu'

import getStyles from './style'

const InviteVerifyScreen = () => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)

  const handleOpenDiscord = useCallback(() => Linking.openURL(DISCORD_URL), [])
  const handleOpenTwitter = useCallback(() => Linking.openURL(TWITTER_URL), [])

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
          <Trans>
            <Text>
              <Text>{'You can join our '}</Text>
              <Text color={colors.violet} onPress={handleOpenDiscord}>
                Discord
              </Text>
              <Text>{' or check '}</Text>
              <Text color={colors.violet} onPress={handleOpenTwitter}>
                Twitter
              </Text>
              <Text>{' for invites.'}</Text>
            </Text>
          </Trans>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(InviteVerifyScreen)
