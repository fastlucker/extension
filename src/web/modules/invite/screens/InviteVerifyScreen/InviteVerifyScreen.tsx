import React, { useCallback } from 'react'
import { Linking, View } from 'react-native'

import AmbireLogoWithTextMonochrome from '@common/assets/svg/AmbireLogoWithTextMonochrome'
import UnlockScreenBackground from '@common/assets/svg/UnlockScreenBackground'
import SeparatorWithText from '@common/components/SeparatorWithText'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import { DISCORD_URL, TELEGRAM_URL, TWITTER_URL } from '@web/constants/social'
import VerifyInviteCodeForm from '@web/modules/invite/components/VerifyInviteCodeForm'

import getStyles from './style'

const InviteVerifyScreen = () => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)

  const handleOpenDiscord = useCallback(() => Linking.openURL(DISCORD_URL), [])
  const handleOpenTwitter = useCallback(() => Linking.openURL(TWITTER_URL), [])
  const handleOpenTelegram = useCallback(() => Linking.openURL(TELEGRAM_URL), [])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <View style={styles.headerContainer}>
          <AmbireLogoWithTextMonochrome width={115} height={120} />
          <View style={styles.backgroundSVG}>
            {/* A little bit larger, because the SVG is rounded at the bottom, */}
            {/* and this way the rounded part overlaps with the overflow hidden parent */}
            <UnlockScreenBackground width={410} height={246} />
          </View>
        </View>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mb0} contentContainerStyle={spacings.pt0}>
        <View style={styles.container}>
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
