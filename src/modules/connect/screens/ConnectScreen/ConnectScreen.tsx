import React from 'react'

import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'

const ConnectScreen = () => {
  const { handleConnect } = useWalletConnect()

  return (
    <QRCodeScanner
      onScan={(data) => {
        console.log('data', data)
        handleConnect(data)
      }}
    />
  )
}

export default ConnectScreen
