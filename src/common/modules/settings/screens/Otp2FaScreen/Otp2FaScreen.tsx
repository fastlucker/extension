import React, { useCallback } from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import Otp2FaForm from '@common/modules/settings/components/OTP2FaForm'
import spacings from '@common/styles/spacings'

const Otp2FaScreen = () => {
  const {
    params: { signerAddress, selectedAccountId }
  } = useRoute()

  const handleSubmit = useCallback((formValues) => {
    console.log(formValues)
  }, [])

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Otp2FaForm
          signerAddress={signerAddress}
          selectedAccountId={selectedAccountId}
          onSubmit={handleSubmit}
        />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default Otp2FaScreen
