import React from 'react'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'

const AccountsScreen = () => {
  const { navigate } = useNavigation()
  return (
    <Wrapper hasBottomTabNav={false} contentContainerStyle={spacings.pt0}>
      <Text style={text.center} fontSize={20}>
        Accounts
      </Text>
      <Button text="Add Account" onPress={() => navigate('get-started')} />
    </Wrapper>
  )
}

export default React.memo(AccountsScreen)
