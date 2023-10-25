import React from 'react'
import { Pressable, View } from 'react-native'

import AccountsIcon from '@common/assets/svg/AccountsIcon'
import CustomTokensIcon from '@common/assets/svg/CustomTokensIcon'
import EmailVaultIcon from '@common/assets/svg/EmailVaultIcon'
import KeyStoreSettingsIcon from '@common/assets/svg/KeyStoreSettingsIcon'
import NetworksIcon from '@common/assets/svg/NetworksIcon'
import TransactionHistoryIcon from '@common/assets/svg/TransactionHistoryIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'

const sidebarItems = [
  {
    key: 'accounts',
    Icon: ({ color }: { color: string }) => <AccountsIcon color={color} />,
    label: 'Accounts',
    path: '/settings/accounts'
  },
  {
    key: 'networks',
    Icon: ({ color }: { color: string }) => <NetworksIcon color={color} />,
    label: 'Networks',
    path: '/settings/networks'
  },
  {
    key: 'transaction-history',
    Icon: ({ color }: { color: string }) => <TransactionHistoryIcon color={color} />,
    label: 'Transaction History',
    path: '/settings/transaction-history'
  },
  {
    key: 'keystore-settings',
    Icon: ({ color }: { color: string }) => <KeyStoreSettingsIcon color={color} />,
    label: 'Ambire Key Store',
    path: '/settings/keystore-settings'
  },
  {
    key: 'email-vault',
    Icon: ({ color }: { color: string }) => <EmailVaultIcon color={color} />,
    label: 'Email Vault',
    path: '/settings/email-vault'
  },
  {
    key: 'custom-tokens',
    Icon: ({ color }: { color: string }) => <CustomTokensIcon color={color} />,
    label: 'Custom Tokens',
    path: '/settings/custom-tokens'
  }
]

const Sidebar = ({ activeLink }: { activeLink: string }) => {
  return (
    <View style={{ paddingVertical: 20, position: 'relative' }}>
      <Text style={{ marginLeft: 16, marginBottom: 24 }} fontSize={20} weight="medium">
        Settings
      </Text>
      {sidebarItems.map((item) => {
        const isActive = activeLink === item.key
        return (
          <Pressable
            key={item.key}
            onPress={() => {
              console.log(item.path)
            }}
            style={{
              flexDirection: 'row',
              paddingLeft: 16,
              paddingVertical: 16,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              width: 250,
              backgroundColor: isActive ? '#E7E9FB' : 'transparent'
            }}
          >
            <item.Icon color={isActive ? colors.violet : colors.martinique} />
            <Text
              style={{ marginLeft: 15 }}
              color={isActive ? colors.violet : colors.martinique}
              fontSize={16}
              weight="medium"
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
      <View />
    </View>
  )
}

export default Sidebar
