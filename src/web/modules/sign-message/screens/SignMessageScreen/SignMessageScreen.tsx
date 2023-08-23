import React from 'react'

import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'
import useApproval from '@web/hooks/useApproval'
import useMainControllerState from '@web/hooks/useMainControllerState'

const SignMessageScreen = () => {
  const { approval } = useApproval()
  const mainState = useMainControllerState()
  console.log(mainState)
  console.log('sign message approval: ', approval)
  return (
    <Wrapper hasBottomTabNav={false} contentContainerStyle={spacings.pt0}>
      <Text style={text.center} fontSize={100}>
        Sign Message Screen
      </Text>
    </Wrapper>
  )
}

export default React.memo(SignMessageScreen)
