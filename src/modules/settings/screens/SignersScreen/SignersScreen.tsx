import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import AddHardwareWalletSigner from '@modules/settings/components/AddHardwareWalletSigner'
import SignersList from '@modules/settings/components/SignersList'

const SignersScreen = () => {
  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <SignersList />
        <AddHardwareWalletSigner />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default SignersScreen
