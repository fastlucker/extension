import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import DiscordIcon from '@common/assets/svg/DiscordIcon'
import TelegramIcon from '@common/assets/svg/TelegramIcon'
import TwitterIcon from '@common/assets/svg/TwitterIcon'
import BackButton from '@common/components/BackButton'
import DefaultWalletToggle from '@common/components/DefaultWalletToggle'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { getSettingsPages } from '@web/modules/settings/components/SettingsPage/Sidebar/Sidebar'
import commonWebStyles from '@web/styles/utils/common'

import getStyles from './styles'

const TELEGRAM_URL = 'https://t.me/AmbireOfficial'
const TWITTER_URL = 'https://twitter.com/AmbireWallet'
const DISCORD_URL = 'https://discord.gg/QQb4xc4ksJ'

const SOCIAL = [
  { Icon: TwitterIcon, url: TWITTER_URL, label: 'Twitter' },
  { Icon: TelegramIcon, url: TELEGRAM_URL, label: 'Telegram' },
  { Icon: DiscordIcon, url: DISCORD_URL, label: 'Discord' }
]

const NavMenu = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { styles, theme } = useTheme(getStyles)
  const { setIsDefaultWallet, isDefaultWallet } = useBackgroundService()
  const settingsPages = getSettingsPages(t)

  return (
    <TabLayoutContainer
      hideFooterInPopup
      footer={<BackButton />}
      header={<Header withPopupBackButton />}
      style={spacings.ph0}
    >
      <View style={commonWebStyles.contentContainer}>
        <View
          style={[
            styles.defaultWalletContainer,
            {
              backgroundColor: isDefaultWallet ? theme.infoBackground : '#F6851B14'
            }
          ]}
        >
          <View style={[spacings.prXl, flexbox.flex1]}>
            {!isDefaultWallet && (
              <Text fontSize={14} weight="medium" color="#F6851B" numberOfLines={2}>
                {t(
                  'Another wallet is set as default browser wallet for connecting with dApps. You can switch it to Ambire Wallet.'
                )}
              </Text>
            )}
            {!!isDefaultWallet && (
              <Text fontSize={14} weight="medium" appearance="infoText" numberOfLines={2}>
                {t(
                  'Ambire Wallet is set as your default browser wallet for connecting with dApps.'
                )}
              </Text>
            )}
          </View>
          <DefaultWalletToggle
            isOn={!!isDefaultWallet}
            onToggle={() => setIsDefaultWallet(!isDefaultWallet)}
          />
        </View>
        <TabLayoutWrapperMainContent>
          <View style={[spacings.ph]}>
            <Text fontSize={20} weight="medium" style={[spacings.mbMd, spacings.pl]}>
              {t('Settings')}
            </Text>
            {settingsPages.map(({ Icon, label, path, key }) => {
              return (
                <Pressable
                  style={({ hovered }: any) => [
                    styles.menuItem,
                    hovered ? { backgroundColor: theme.tertiaryBackground } : {}
                  ]}
                  key={key}
                  onPress={() => {
                    if (Object.values(ROUTES).includes(path)) {
                      navigate(path)
                      return
                    }

                    alert('Not implemented yet')
                  }}
                >
                  {!!Icon && <Icon width={24} height={24} color={theme.primaryText} />}
                  <Text fontSize={16} style={spacings.ml} weight="medium" appearance="primaryText">
                    {label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
          <View style={styles.separatorWrapper}>
            <View style={styles.separator} />
          </View>
          <View style={[flexbox.directionRow, spacings.ph, spacings.pbLg]}>
            {SOCIAL.map(({ Icon, url, label }) => (
              <Pressable
                style={() => [
                  flexbox.directionRow,
                  flexbox.alignCenter,
                  flexbox.flex1,
                  spacings.ph,
                  spacings.pvTy,
                  common.borderRadiusPrimary
                ]}
                key={url}
                onPress={() => console.log(url)}
              >
                {({ hovered }: any) => (
                  <>
                    <Icon
                      style={spacings.mrSm}
                      color={hovered ? iconColors.secondary : iconColors.primary}
                    />
                    <Text
                      fontSize={14}
                      weight="medium"
                      appearance={hovered ? 'primaryText' : 'secondaryText'}
                    >
                      {label}
                    </Text>
                  </>
                )}
              </Pressable>
            ))}
          </View>
        </TabLayoutWrapperMainContent>
      </View>
    </TabLayoutContainer>
  )
}

export default NavMenu
