import React from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import EnableOTP2FaForm from '@common/modules/settings/components/EnableOTP2FaForm'
import spacings from '@common/styles/spacings'

const EnableOtp2FaScreen = () => {
  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <EnableOTP2FaForm />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default EnableOtp2FaScreen
