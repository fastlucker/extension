import React from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import spacings from '@common/styles/spacings'
import AddHardwareWalletSigner from '@mobile/settings/components/AddHardwareWalletSigner'
import SignersList from '@mobile/settings/components/SignersList'

const SignersScreen = () => {
  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <SignersList />
        <AddHardwareWalletSigner />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default SignersScreen
