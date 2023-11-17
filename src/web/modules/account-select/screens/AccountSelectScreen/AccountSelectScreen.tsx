import React from 'react'
import { View } from 'react-native'

import BackButton from '@common/components/BackButton'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useAccounts from '@common/hooks/useAccounts'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { TabLayoutContainer } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import Account from '@web/modules/account-select/components/Account'

import getStyles from './styles'

const AccountSelectScreen = () => {
  const { styles } = useTheme(getStyles)
  const { accounts, control } = useAccounts()
  const { goBack } = useNavigation()

  return (
    <TabLayoutContainer
      header={<Header withPopupBackButton withAmbireLogo />}
      footer={<BackButton />}
      hideFooterInPopup
    >
      <View style={[flexboxStyles.flex1, spacings.pv]}>
        <View style={styles.container}>
          <Search control={control} placeholder="Search for account" style={styles.searchBar} />
        </View>

        <Wrapper contentContainerStyle={styles.container}>
          {accounts.length ? (
            accounts.map((account) => (
              <Account onSelect={goBack} key={account.addr} account={account} />
            ))
          ) : (
            // @TODO: add a proper label
            <Text>No accounts found</Text>
          )}
        </Wrapper>
      </View>
    </TabLayoutContainer>
  )
}

export default AccountSelectScreen
