import React, { useCallback } from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import Otp2FaForm from '@common/modules/settings/components/OTP2FaForm'
import spacings from '@common/styles/spacings'

import useOtp2Fa from '../../hooks/useOtp2Fa'

const EnableOtp2FaScreen = () => {
  const {
    params: { signerAddress, selectedAccountId }
  } = useRoute()

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Otp2FaForm signerAddress={signerAddress} selectedAccountId={selectedAccountId} />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default EnableOtp2FaScreen
