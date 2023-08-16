import React from 'react'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'

const AccountsScreen = () => {
  const { navigate } = useNavigation()
  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false} contentContainerStyle={spacings.pt0}>
        <Text style={text.center} fontSize={20}>
          Accounts
        </Text>
        <Button text="Add Account" onPress={() => navigate('get-started')} />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default React.memo(AccountsScreen)
