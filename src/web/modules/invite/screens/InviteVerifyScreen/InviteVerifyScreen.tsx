import React, { useCallback } from 'react'
import { Linking, View } from 'react-native'

import AmbireLogoWithTextMonochrome from '@common/assets/svg/AmbireLogoWithTextMonochrome'
import UnlockScreenBackground from '@common/assets/svg/UnlockScreenBackground'
import SeparatorWithText from '@common/components/SeparatorWithText'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import { DISCORD_URL, TELEGRAM_URL, TWITTER_URL } from '@web/constants/social'
import VerifyInviteCodeForm from '@web/modules/invite/components/VerifyInviteCodeForm'

import getStyles from './styles'

const InviteVerifyScreen = () => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)

  const handleOpenDiscord = useCallback(() => Linking.openURL(DISCORD_URL), [])
  const handleOpenTwitter = useCallback(() => Linking.openURL(TWITTER_URL), [])
  const handleOpenTelegram = useCallback(() => Linking.openURL(TELEGRAM_URL), [])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo customTitle=" " />}
    >
      <TabLayoutWrapperMainContent>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.backgroundSVG}>
              <UnlockScreenBackground width={400} />
            </View>
            <AmbireLogoWithTextMonochrome width={100} />
          </View>
          <VerifyInviteCodeForm />
          <SeparatorWithText text={t("Don't have one?")} />
          <Trans>
            <Text style={spacings.mbTy}>
              <Text color={theme.secondaryText}>{'You can join our '}</Text>
              <Text style={styles.link} onPress={handleOpenDiscord}>
                Discord
              </Text>
              <Text color={theme.secondaryText}>{' or '}</Text>
              <Text style={styles.link} onPress={handleOpenTelegram}>
                Telegram.
              </Text>
            </Text>
          </Trans>
          <Trans>
            <Text>
              <Text color={theme.secondaryText}>{'Alternatively, you can check our '}</Text>
              <Text style={styles.link} onPress={handleOpenTwitter}>
                Twitter
              </Text>
              <Text color={theme.secondaryText}>{' for invites.'}</Text>
            </Text>
          </Trans>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(InviteVerifyScreen)
