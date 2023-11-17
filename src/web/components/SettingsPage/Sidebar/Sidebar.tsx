import React from 'react'
import { ColorValue, Pressable, View } from 'react-native'

import AccountsIcon from '@common/assets/svg/AccountsIcon'
import CustomTokensIcon from '@common/assets/svg/CustomTokensIcon'
import EmailVaultIcon from '@common/assets/svg/EmailVaultIcon'
import KeyStoreSettingsIcon from '@common/assets/svg/KeyStoreSettingsIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import NetworksIcon from '@common/assets/svg/NetworksIcon'
import TransactionHistoryIcon from '@common/assets/svg/TransactionHistoryIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation/useNavigation.web'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

const sidebarItems = [
  {
    key: 'accounts',
    Icon: ({ color }: { color: ColorValue }) => <AccountsIcon color={color} />,
    label: 'Accounts',
    path: '/settings/accounts'
  },
  {
    key: 'networks',
    Icon: ({ color }: { color: ColorValue }) => <NetworksIcon color={color} />,
    label: 'Networks',
    path: '/settings/networks'
  },
  {
    key: 'transaction-history',
    Icon: ({ color }: { color: ColorValue }) => <TransactionHistoryIcon color={color} />,
    label: 'Transaction History',
    path: '/settings/transaction-history'
  },
  {
    key: 'keystore-settings',
    Icon: ({ color }: { color: ColorValue }) => <KeyStoreSettingsIcon color={color} />,
    label: 'Ambire Key Store',
    path: '/settings/keystore-settings'
  },
  {
    key: 'email-vault',
    Icon: ({ color }: { color: ColorValue }) => <EmailVaultIcon color={color} />,
    label: 'Email Vault',
    path: '/settings/email-vault'
  },
  {
    key: 'custom-tokens',
    Icon: ({ color }: { color: ColorValue }) => <CustomTokensIcon color={color} />,
    label: 'Custom Tokens',
    path: '/settings/custom-tokens'
  }
]

const Sidebar = ({ activeLink }: { activeLink: string }) => {
  const { theme } = useTheme()
  const { navigate } = useNavigation()
  return (
    <View style={{ ...spacings.pbMd, position: 'relative' }}>
      <Pressable
        style={({ hovered }: any) => [
          spacings.mbLg,
          spacings.pv,
          spacings.ph,
          flexboxStyles.directionRow,
          flexboxStyles.alignCenter,
          {
            width: '100%',
            backgroundColor: hovered ? theme.tertiaryBackground : 'transparent',
            borderBottomRightRadius: 6
          }
        ]}
        onPress={() => navigate(ROUTES.dashboard)}
      >
        <LeftArrowIcon color={theme.secondaryText} />
        <Text fontSize={16} weight="medium" appearance="secondaryText" style={spacings.mlLg}>
          Dashboard
        </Text>
      </Pressable>
      <Text style={[spacings.ml, spacings.mbLg]} fontSize={20} weight="medium">
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
            style={({ hovered }: any) => [
              flexboxStyles.directionRow,
              spacings.pl,
              spacings.pv,
              {
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6,
                width: 250,
                backgroundColor: isActive || hovered ? theme.tertiaryBackground : 'transparent'
              }
            ]}
          >
            <item.Icon color={isActive ? theme.primary : theme.primaryText} />
            <Text
              style={spacings.ml}
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
