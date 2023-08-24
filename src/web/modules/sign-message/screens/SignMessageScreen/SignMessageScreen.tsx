import React from 'react'

import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'

const SignMessageScreen = () => {
  const signMessageState = useSignMessageControllerState()
  console.log('signMessageState: ', signMessageState)

  return (
    <Wrapper hasBottomTabNav={false} contentContainerStyle={spacings.pt0}>
      <Text style={text.center} fontSize={100}>
        Sign Message Screen
      </Text>
    </Wrapper>
  )
}

export default React.memo(SignMessageScreen)
