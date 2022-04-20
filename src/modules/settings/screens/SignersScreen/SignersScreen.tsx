import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import AddHardwareWalletSigner from '@modules/settings/components/AddHardwareWalletSigner'
import SignersList from '@modules/settings/components/SignersList'

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
