import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { termsAndPrivacyURL } from '@modules/auth/constants/URLs'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer'

import styles from './style'

const HELP_CENTER_URL = 'https://help.ambire.com/hc/en-us/categories/4404980091538-Ambire-Wallet'
const REPORT_ISSUE_URL = 'https://help.ambire.com/hc/en-us/requests/new'

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { t } = useTranslation()
  const { navigation } = props

  const menu = [
    { name: t('Dashboards'), route: 'dashboard' },
    { name: t('Earn'), route: 'earn' },
    { name: t('Send'), route: 'send' },
    { name: t('Swap'), route: 'swap' },
    { name: t('Transactions'), route: 'transactions' },
    { name: t('Cross-chain'), route: 'cross-chain' },
    { name: t('Deposit'), route: 'deposit' }
  ]

  const help = [
    { name: t('Help Center'), url: HELP_CENTER_URL },
    { name: t('Report an issue'), url: REPORT_ISSUE_URL },
    { name: t('Terms of Service'), url: termsAndPrivacyURL }
  ]

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={spacings.mhLg}>
      <Text style={styles.menuTitle}>{t('Menu')}</Text>
      <View style={spacings.mbLg}>
        {menu.map((m) => (
          <TouchableOpacity key={m.name} onPress={() => navigation.navigate(m.route)}>
            <Text>{m.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {help.map((h) => (
        <TouchableOpacity key={h.name} onPress={() => Linking.openURL(h.url)}>
          <Text style={styles.link}>{h.name}</Text>
        </TouchableOpacity>
      ))}
    </DrawerContentScrollView>
  )
}

export default DrawerContent
