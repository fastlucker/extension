import React from 'react'

import useHardwareWalletActions from '@modules/auth/hooks/useHardwareWalletActions'
import HardwareWalletScanDevices from '@modules/common/components/HardwareWalletScanDevices'
import RequireBluetooth from '@modules/common/components/RequireBluetooth'

const HardwareWalletScreen = () => {
  const { addAccount } = useHardwareWalletActions()

  return (
    <RequireBluetooth>
      <HardwareWalletScanDevices onSelectDevice={addAccount} />
    </RequireBluetooth>
  )
}

export default HardwareWalletScreen
