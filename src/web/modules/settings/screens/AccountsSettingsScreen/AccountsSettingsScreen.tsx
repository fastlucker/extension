import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useAccounts from '@common/hooks/useAccounts/useAccounts'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import Account from '@web/modules/account-select/components/Account'
import SettingsPage from '@web/modules/settings/components/SettingsPage'

const AccountsSettingsScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { accounts, control } = useAccounts()

  return (
    <SettingsPage currentPage="accounts">
      <View
        style={[
          flexboxStyles.directionRow,
          flexboxStyles.alignCenter,
          flexboxStyles.justifySpaceBetween,
          spacings.mbXl
        ]}
      >
        <Text fontSize={20} weight="medium">
          {t('Accounts')}
        </Text>
        <Search placeholder="Search for account" control={control} />
      </View>
      <View style={spacings.mb}>
        {accounts.map((account) => (
          <Account isCopyVisible={false} key={account.addr} account={account} />
        ))}
      </View>
      <Button onPress={() => navigate(ROUTES.getStarted)} text="Add account" />
    </SettingsPage>
  )
}

export default React.memo(AccountsSettingsScreen)
