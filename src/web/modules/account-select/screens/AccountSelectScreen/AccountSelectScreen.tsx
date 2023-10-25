import React from 'react'
import { View } from 'react-native'

import Account from '@common/components/Account/Account'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useAccounts from '@common/hooks/useAccounts/useAccounts'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'

import styles from './styles'

const AccountSelectScreen = () => {
  const { control, accounts } = useAccounts()
  const mainCtrl = useMainControllerState()

  return (
    <View style={[flexboxStyles.flex1, spacings.pv, spacings.ph]}>
      <View style={styles.container}>
        <Search control={control} placeholder="Search for accounts" style={styles.searchBar} />
      </View>

      <Wrapper contentContainerStyle={styles.container}>
        {accounts.length ? (
          accounts.map((account) => (
            <Account
              key={account.addr}
              account={account}
              selectedAccount={mainCtrl.selectedAccount}
            />
          ))
        ) : (
          // @TODO: add a proper label
          <Text>No accounts found</Text>
        )}
      </Wrapper>
    </View>
  )
}

export default AccountSelectScreen
