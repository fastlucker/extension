import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { termsAndPrivacyURL } from '@modules/auth/constants/URLs'
import AppVersion from '@modules/common/components/AppVersion'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer'

import AppLocking from './AppLocking'
import BiometricsSign from './BiometricsSign'
import LocalAuth from './LocalAuth'
import Passcode from './Passcode'
import styles from './style'
import Theme from './Theme'

const HELP_CENTER_URL = 'https://help.ambire.com/hc/en-us/categories/4404980091538-Ambire-Wallet'
const REPORT_ISSUE_URL = 'https://help.ambire.com/hc/en-us/requests/new'

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { t } = useTranslation()
  const { navigation } = props

  const menu = [
    { name: t('Dashboard'), route: 'dashboard-tab' },
    { name: t('Earn'), route: 'earn-tab' },
    { name: t('Send'), route: 'send-tab' },
    { name: t('Swap'), route: 'swap-tab' },
    { name: t('Transactions'), route: 'transactions-tab' },
    // TODO: Not implemented yet.
    // { name: t('Cross-chain'), route: '' },
    { name: t('Deposit'), route: 'receive' }
  ]

  const help = [
    { name: t('Help Center'), url: HELP_CENTER_URL },
    { name: t('Report an issue'), url: REPORT_ISSUE_URL },
    { name: t('Terms of Service'), url: termsAndPrivacyURL }
  ]

  const settings = [
    { name: t('Signers'), route: 'signers' }
    // TODO: Not implemented yet.
    // { name: t('Security'), route: 'security' }
  ]

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={spacings.mhLg} style={spacings.mvLg}>
      <Text fontSize={16} underline style={styles.menuTitle}>
        {t('Menu')}
      </Text>
      <View style={spacings.mbLg}>
        {menu.map((m) => (
          <TouchableOpacity key={m.name} onPress={() => navigation.navigate(m.route)}>
            <Text style={spacings.mbSm}>{m.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={spacings.mbLg}>
        <Text fontSize={16} underline style={styles.menuTitle}>
          {t('Settings')}
        </Text>
        <Passcode />
        <LocalAuth />
        <BiometricsSign />
        <AppLocking />
        <Theme />
        {settings.map((s) => (
          <TouchableOpacity key={s.name} onPress={() => navigation.navigate(s.route)}>
            <Text style={spacings.mbSm}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {help.map((h) => (
        <TouchableOpacity key={h.name} onPress={() => Linking.openURL(h.url)}>
          <Text style={styles.link}>{h.name}</Text>
        </TouchableOpacity>
      ))}
      <AppVersion />
    </DrawerContentScrollView>
  )
}

export default DrawerContent
