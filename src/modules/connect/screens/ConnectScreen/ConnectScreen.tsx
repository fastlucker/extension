import React from 'react'

import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
import { useIsFocused } from '@react-navigation/native'

const ConnectScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused()
  const { handleConnect } = useWalletConnect()

  if (!isFocused) {
    return null
  }

  return (
    <QRCodeScanner
      onScan={(uri) => {
        handleConnect(uri)
        navigation.goBack()
      }}
    />
  )
}

export default ConnectScreen
