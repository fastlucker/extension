import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

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
import spacings, { SPACING_MI } from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'

export const getSettingsPages = (t: (string: string) => string) => [
  {
    key: 'accounts',
    Icon: AccountsIcon,
    label: t('Accounts'),
    path: ROUTES.accounts
  },
  {
    key: 'networks',
    Icon: NetworksIcon,
    label: t('Networks'),
    path: ROUTES.networksSettings
  },
  {
    key: 'transaction-history',
    Icon: TransactionHistoryIcon,
    label: t('Transaction History'),
    path: ROUTES.transactions
  },
  {
    key: 'device-password',
    Icon: KeyStoreSettingsIcon,
    label: t('Device Password'),
    path: ROUTES.devicePassword
  },
  {
    key: 'email-vault',
    Icon: () => <EmailVaultIcon strokeWidth={3.5} width={24} height={24} />,
    label: t('Email Vault'),
    path: '/settings/email-vault'
  },
  {
    key: 'custom-tokens',
    Icon: CustomTokensIcon,
    label: t('Custom Tokens'),
    path: '/settings/custom-tokens'
  }
]

const Sidebar = ({ activeLink }: { activeLink: string }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const sidebarItems = getSettingsPages(t)

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
            borderRadius: BORDER_RADIUS_PRIMARY
          }
        ]}
        onPress={() => navigate(ROUTES.dashboard)}
      >
        <LeftArrowIcon color={theme.secondaryText} />
        <Text fontSize={16} weight="medium" appearance="secondaryText" style={spacings.mlLg}>
          {t('Dashboard')}
        </Text>
      </Pressable>
      <Text style={[spacings.ml, spacings.mbLg]} fontSize={20} weight="medium">
        {t('Settings')}
      </Text>
      {sidebarItems.map((item) => {
        const isActive = activeLink === item.key
        return (
          <Pressable
            key={item.key}
            onPress={() => {
              if (Object.values(ROUTES).includes(item.path)) {
                navigate(item.path)
                return
              }

              alert('Not implemented yet')
            }}
            style={({ hovered }: any) => [
              flexboxStyles.directionRow,
              spacings.pl,
              spacings.pv,
              {
                borderRadius: BORDER_RADIUS_PRIMARY,
                marginVertical: SPACING_MI / 2,
                width: 250,
                backgroundColor: isActive || hovered ? theme.tertiaryBackground : 'transparent'
              }
            ]}
          >
            <item.Icon color={isActive ? theme.primary : theme.primaryText} />
            <Text
              style={spacings.ml}
              color={isActive ? theme.primary : theme.primaryText}
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
