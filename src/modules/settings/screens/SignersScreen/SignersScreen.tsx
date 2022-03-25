import React from 'react'

import Wrapper from '@modules/common/components/Wrapper'
import AddHardwareWalletSigner from '@modules/settings/components/AddHardwareWalletSigner'
import SignersList from '@modules/settings/components/SignersList'

const SignersScreen = () => {
  return (
    <Wrapper>
      <SignersList />
      <AddHardwareWalletSigner />
    </Wrapper>
  )
}

export default SignersScreen
