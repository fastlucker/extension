import React from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Search from '@common/components/Search'
import useAccounts from '@common/hooks/useAccounts/useAccounts'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import Account from '@web/modules/account-select/components/Account'
import AddAccount from '@web/modules/account-select/components/AddAccount'
import SettingsPage from '@web/modules/settings/components/SettingsPage'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'

const AccountsSettingsScreen = () => {
  const { addToast } = useToast()
  const { accountPreferences } = useSettingsControllerState()
  const { accounts, control } = useAccounts()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  return (
    <SettingsPage currentPage="accounts">
      <SettingsPageHeader title="Accounts">
        <Search placeholder="Search for account" control={control} />
      </SettingsPageHeader>
      <View style={spacings.mb}>
        {accounts.map((account) => (
          <Account
            onSelect={() =>
              addToast(
                `Selected account ${accountPreferences[account.addr]?.label || account.addr}`
              )
            }
            isCopyVisible={false}
            key={account.addr}
            account={account}
          />
        ))}
      </View>
      <Button type="secondary" onPress={openBottomSheet as any} text="Add account" />
      <BottomSheet sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <AddAccount />
      </BottomSheet>
    </SettingsPage>
  )
}

export default React.memo(AccountsSettingsScreen)
