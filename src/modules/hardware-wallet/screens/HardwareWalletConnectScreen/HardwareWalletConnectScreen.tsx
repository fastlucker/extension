import React from 'react'

import HardwareWalletSelectConnection from '@modules/hardware-wallet/components/HardwareWalletSelectConnection'
import useHardwareWalletActions from '@modules/hardware-wallet/hooks/useHardwareWalletActions'

const HardwareWalletConnectScreen = () => {
  const { addAccount } = useHardwareWalletActions()

  return <HardwareWalletSelectConnection onSelectDevice={addAccount} />
}

export default HardwareWalletConnectScreen
