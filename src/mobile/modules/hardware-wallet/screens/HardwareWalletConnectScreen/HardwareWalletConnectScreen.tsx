import React from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import HardwareWalletSelectConnection from '@mobile/modules/hardware-wallet/components/HardwareWalletSelectConnection'
import useHardwareWalletActions from '@mobile/modules/hardware-wallet/hooks/useHardwareWalletActions'

const HardwareWalletConnectScreen = () => {
  const { addAccount } = useHardwareWalletActions()

  return (
    <GradientBackgroundWrapper>
      <HardwareWalletSelectConnection onSelectDevice={addAccount} />
    </GradientBackgroundWrapper>
  )
}

export default HardwareWalletConnectScreen
