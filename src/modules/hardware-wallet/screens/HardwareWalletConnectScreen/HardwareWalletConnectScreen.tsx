import React from 'react'

import HardwareWalletConnect from '@modules/hardware-wallet/components/HardwareWalletConnect'
import useHardwareWalletActions from '@modules/hardware-wallet/hooks/useHardwareWalletActions'

const HardwareWalletConnectScreen = () => {
  const { addAccount } = useHardwareWalletActions()

  return <HardwareWalletConnect onSelectDevice={addAccount} />
}

export default HardwareWalletConnectScreen
