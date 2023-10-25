import React from 'react'
import { View } from 'react-native'

import Account from '@common/components/Account/Account'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useAccounts from '@common/hooks/useAccounts/useAccounts'
import SettingsPage from '@web/components/SettingsPage'
import useMainControllerState from '@web/hooks/useMainControllerState'

const AccountsScreen = () => {
  const { accounts, control } = useAccounts()
  const mainCtrl = useMainControllerState()
  return (
    <SettingsPage currentPage="accounts">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
        <Text fontSize={20} weight="medium">
          Accounts
        </Text>
        <Search control={control} />
      </View>
      <View>
        {accounts.map((account) => (
          <Account
            selectedAccount={mainCtrl.selectedAccount}
            key={account.addr}
            account={account}
          />
        ))}
      </View>
    </SettingsPage>
  )
}

export default React.memo(AccountsScreen)
