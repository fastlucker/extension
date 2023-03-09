import React from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import HardwareWalletSelectConnection from '@mobile/hardware-wallet/components/HardwareWalletSelectConnection'
import useHardwareWalletActions from '@mobile/hardware-wallet/hooks/useHardwareWalletActions'

const HardwareWalletConnectScreen = () => {
  const { addAccount } = useHardwareWalletActions()

  return (
    <GradientBackgroundWrapper>
      <HardwareWalletSelectConnection onSelectDevice={addAccount} />
    </GradientBackgroundWrapper>
  )
}

export default HardwareWalletConnectScreen
