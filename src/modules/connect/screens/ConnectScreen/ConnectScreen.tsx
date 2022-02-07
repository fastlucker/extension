import React, { useEffect } from 'react'

import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'

const ConnectScreen = () => {
  const { handleConnect } = useWalletConnect()

  useEffect(() => {
    setTimeout(() => {
      const uri =
        'wc:f83477a6-26f8-45bb-b6ae-f5057bd1dc82@1?bridge=https%3A%2F%2F4.bridge.walletconnect.org&key=b0898db67ec9c827f7720c29a6da39fac264f4b272d689e5d5cc8a502639d78d'
      handleConnect(uri)
    }, 1500)
  }, [])
  return (
    <QRCodeScanner
      onScan={(data) => {
        console.log(data)
      }}
    />
  )
}

export default ConnectScreen
