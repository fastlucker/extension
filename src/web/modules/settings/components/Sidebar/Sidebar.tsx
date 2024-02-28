import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
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
import PaddedScrollView from '@common/components/PaddedScrollView'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation/useNavigation.web'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import SettingsLink from '@web/modules/settings/components/SettingsLink'

import getStyles from './styles'

export const SETTINGS_LINKS = [
  {
    key: 'accounts',
    Icon: React.memo(AccountsIcon),
    label: 'Accounts',
    path: ROUTES.accountsSettings
  },
  {
    key: 'networks',
    Icon: React.memo(NetworksIcon),
    label: 'Networks',
    path: ROUTES.networksSettings
  },
  {
    key: 'transactions',
    Icon: React.memo(TransactionHistoryIcon),
    label: 'Transaction History',
    path: ROUTES.transactions
  },
  {
    key: 'messages',
    Icon: React.memo(SignedMessageIcon),
    label: 'Signed Messages',
    path: ROUTES.signedMessages
  },
  {
    key: 'device-password',
    Icon: React.memo(KeyStoreSettingsIcon),
    label: 'Device Password',
    path: ROUTES.devicePassword
  },
  {
    key: 'email-vault',
    Icon: React.memo(({ color }: SvgProps) => (
      <EmailVaultIcon strokeWidth={3.5} width={24} height={24} color={color} />
    )),
    label: 'Email Vault',
    path: '/settings/email-vault'
  },
  {
    key: 'custom-tokens',
    Icon: React.memo(CustomTokensIcon),
    label: 'Custom Tokens',
    path: '/settings/custom-tokens'
  }
]

const OTHER_LINKS = [
  {
    key: 'help-center',
    Icon: React.memo(HelpIcon),
    label: 'Help Center',
    path: 'https://help.ambire.com/hc/en-us',
    isExternal: true
  },
  {
    key: 'report-issue',
    Icon: React.memo(BugIcon),
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

const Sidebar = ({ activeLink }: { activeLink?: string }) => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.secondaryBackground,
      to: theme.tertiaryBackground
    }
  })

  return (
    <View style={{ ...spacings.pbLg, position: 'relative', height: '100%' }}>
      <AnimatedPressable
        style={[styles.backToDashboardButton, animStyle]}
        onPress={() => navigate(ROUTES.dashboard)}
        {...bindAnim}
      >
        <LeftArrowIcon color={theme.secondaryText} />
        <Text fontSize={16} weight="medium" appearance="secondaryText" style={spacings.mlLg}>
          {t('Dashboard')}
        </Text>
      </AnimatedPressable>
      <Text style={[spacings.ml, spacings.mbMd]} fontSize={20} weight="medium">
        {t('Settings')}
      </Text>
      <PaddedScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {SETTINGS_LINKS.map((link, i) => {
          const isActive = activeLink === link.key

          return (
            <SettingsLink
              {...link}
              isActive={isActive}
              style={i === SETTINGS_LINKS.length - 1 ? spacings.mb0 : {}}
            />
          )
        })}
        <View
          style={{
            width: '100%',
            borderBottomWidth: 1,
            borderColor: theme.secondaryBorder,
            ...spacings.mv
          }}
        />
        {OTHER_LINKS.map((link, i) => {
          const isActive = activeLink === link.key

          return (
            <SettingsLink
              {...link}
              isActive={isActive}
              style={i === OTHER_LINKS.length - 1 ? spacings.mb0 : {}}
            />
          )
        })}
      </PaddedScrollView>
    </View>
  )
}

export default React.memo(Sidebar)
