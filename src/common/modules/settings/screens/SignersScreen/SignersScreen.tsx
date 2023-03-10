import React from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import AddHardwareWalletSigner from '@common/modules/settings/components/AddHardwareWalletSigner'
import SignersList from '@common/modules/settings/components/SignersList'
import spacings from '@common/styles/spacings'

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
