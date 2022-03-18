import React from 'react'

import useHardwareWalletActions from '@modules/auth/hooks/useHardwareWalletActions'
import useLedgerConnect from '@modules/auth/hooks/useLedgerConnect'
import HardwareWalletScanDevices from '@modules/common/components/HardwareWalletScanDevices'

const HardwareWalletScreen = () => {
  const { addAccount } = useHardwareWalletActions()
  const connect = useLedgerConnect()

  return <HardwareWalletScanDevices onSelectDevice={addAccount} {...connect} />
}

export default HardwareWalletScreen
