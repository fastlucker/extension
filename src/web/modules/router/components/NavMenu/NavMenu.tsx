import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

// import DiscordIcon from '@common/assets/svg/DiscordIcon'
// import TelegramIcon from '@common/assets/svg/TelegramIcon'
// import TwitterIcon from '@common/assets/svg/TwitterIcon'
import BackButton from '@common/components/BackButton'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import styles from '@common/modules/nav-menu/styles'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
// import flexboxStyles from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { getSettingsPages } from '@web/modules/settings/components/SettingsPage/Sidebar/Sidebar'
import commonWebStyles from '@web/styles/utils/common'

// const TELEGRAM_URL = 'https://t.me/AmbireOfficial'
// const TWITTER_URL = 'https://twitter.com/AmbireWallet'
// const DISCORD_URL = 'https://discord.gg/QQb4xc4ksJ'

// const SOCIAL = [
//   { Icon: TwitterIcon, url: TWITTER_URL, label: 'Twitter' },
//   { Icon: TelegramIcon, url: TELEGRAM_URL, label: 'Telegram' },
//   { Icon: DiscordIcon, url: DISCORD_URL, label: 'Discord' }
// ]

const NavMenu = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { theme } = useTheme()

  const settingsPages = getSettingsPages(t)

  return (
    <TabLayoutContainer
      hideFooterInPopup
      footer={<BackButton />}
      header={<Header withPopupBackButton />}
    >
      <TabLayoutWrapperMainContent>
        <View style={commonWebStyles.contentContainer}>
          {settingsPages.map(({ Icon, label, path, key }) => {
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  if (Object.values(ROUTES).includes(path)) {
                    navigate(path)
                    return
                  }

                  alert('Not implemented yet')
                }}
                style={styles.menuItem}
              >
                {!!Icon && <Icon width={24} height={24} color={theme.primaryText} />}
                <Text fontSize={16} style={spacings.ml} weight="medium" appearance="primaryText">
                  {label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
        {/* <View style={[flexboxStyles.directionRow, spacings.mtSm, spacings.mbMd]}>
          {SOCIAL.map(({ Icon, url }) => (
            <TouchableOpacity key={url} onPress={() => console.log(url)}>
              <Icon style={spacings.mr} />
            </TouchableOpacity>
          ))}
        </View> */}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default NavMenu
