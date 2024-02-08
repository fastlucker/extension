import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import AccountsIcon from '@common/assets/svg/AccountsIcon'
import BugIcon from '@common/assets/svg/BugIcon'
import CustomTokensIcon from '@common/assets/svg/CustomTokensIcon'
import EmailVaultIcon from '@common/assets/svg/EmailVaultIcon'
import HelpIcon from '@common/assets/svg/HelpIcon'
import KeyStoreSettingsIcon from '@common/assets/svg/KeyStoreSettingsIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import NetworksIcon from '@common/assets/svg/NetworksIcon'
import SignedMessageIcon from '@common/assets/svg/SignedMessageIcon'
import TransactionHistoryIcon from '@common/assets/svg/TransactionHistoryIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation/useNavigation.web'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'
import SettingsLink from '@web/modules/settings/components/SettingsLink'

export const SETTINGS_LINKS = [
  {
    key: 'accounts',
    Icon: AccountsIcon,
    label: 'Accounts',
    path: ROUTES.accounts
  },
  {
    key: 'networks',
    Icon: NetworksIcon,
    label: 'Networks',
    path: ROUTES.networksSettings
  },
  {
    key: 'transactions',
    Icon: TransactionHistoryIcon,
    label: 'Transaction History',
    path: ROUTES.transactions
  },
  {
    key: 'messages',
    Icon: SignedMessageIcon,
    label: 'Signed Messages',
    path: ROUTES.signedMessages
  },
  {
    key: 'device-password',
    Icon: KeyStoreSettingsIcon,
    label: 'Device Password',
    path: ROUTES.devicePassword
  },
  {
    key: 'email-vault',
    Icon: ({ color }: SvgProps) => (
      <EmailVaultIcon strokeWidth={3.5} width={24} height={24} color={color} />
    ),
    label: 'Email Vault',
    path: '/settings/email-vault'
  },
  {
    key: 'custom-tokens',
    Icon: CustomTokensIcon,
    label: 'Custom Tokens',
    path: '/settings/custom-tokens'
  }
]

const OTHER_LINKS = [
  {
    key: 'help-center',
    Icon: HelpIcon,
    label: 'Help Center',
    path: 'https://help.ambire.com/hc/en-us',
    isExternal: true
  },
  {
    key: 'report-issue',
    Icon: BugIcon,
    label: 'Report an Issue',
    path: 'https://help.ambire.com/hc/en-us/requests/new',
    isExternal: true
  },
  {
    key: 'terms-of-service',
    label: 'Terms of Service',
    path: ROUTES.settingsTerms
  }
]

const Sidebar = ({ activeLink }: { activeLink: string }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { maxWidthSize } = useWindowSize()
  const isWidthXl = maxWidthSize('xl')

  return (
    <View style={{ ...spacings.pbMd, position: 'relative' }}>
      <Pressable
        style={({ hovered }: any) => [
          isWidthXl ? spacings.mbLg : spacings.mb,
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
      {SETTINGS_LINKS.map((link) => {
        const isActive = activeLink === link.key

        return <SettingsLink {...link} isActive={isActive} />
      })}
      <View
        style={{
          width: '100%',
          borderBottomWidth: 2,
          borderColor: theme.secondaryBorder,
          ...(isWidthXl ? spacings.mvXl : spacings.mv)
        }}
      />
      {OTHER_LINKS.map((link) => {
        return <SettingsLink {...link} isActive={false} />
      })}
    </View>
  )
}

export default Sidebar
