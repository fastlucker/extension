import React from 'react'

import useHardwareWalletActions from '@modules/auth/hooks/useHardwareWalletActions'
import HardwareWalletScanDevices from '@modules/common/components/HardwareWalletScanDevices'

const HardwareWalletScreen = () => {
  const { addAccount } = useHardwareWalletActions()

  return <HardwareWalletScanDevices onSelectDevice={addAccount} />
}

export default HardwareWalletScreen
