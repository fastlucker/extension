import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import HardwareWalletSelectConnection from '@modules/hardware-wallet/components/HardwareWalletSelectConnection'
import useHardwareWalletActions from '@modules/hardware-wallet/hooks/useHardwareWalletActions'

const HardwareWalletConnectScreen = () => {
  const { addAccount } = useHardwareWalletActions()

  return (
    <GradientBackgroundWrapper>
      <HardwareWalletSelectConnection onSelectDevice={addAccount} />
    </GradientBackgroundWrapper>
  )
}

export default HardwareWalletConnectScreen
