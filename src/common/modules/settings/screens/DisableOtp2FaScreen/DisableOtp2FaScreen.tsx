import React from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import DisableOTP2FaForm from '@common/modules/settings/components/DisableOTP2FaForm'
import spacings from '@common/styles/spacings'

const DisableOtp2FaScreen = () => {
  const {
    params: { signerAddress, selectedAccountId }
  } = useRoute()

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <DisableOTP2FaForm signerAddress={signerAddress} selectedAccountId={selectedAccountId} />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DisableOtp2FaScreen
