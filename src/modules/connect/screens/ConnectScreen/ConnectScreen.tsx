import React from 'react'

import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
import { useIsFocused } from '@react-navigation/native'

const ConnectScreen = () => {
  const isFocused = useIsFocused()
  const { handleConnect } = useWalletConnect()

  return (
    <>
      {!!isFocused && (
        <QRCodeScanner
          onScan={(data) => {
            console.log('data', data)
            handleConnect(data)
          }}
        />
      )}
    </>
  )
}

export default ConnectScreen
