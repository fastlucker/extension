import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import useIsScreenFocused from '@modules/common/hooks/useIsScreenFocused'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'

const ConnectScreen = ({ navigation }: any) => {
  const isFocused = useIsScreenFocused()
  const { handleConnect } = useWalletConnect()

  if (!isFocused) {
    return null
  }

  return (
    <GradientBackgroundWrapper>
      <QRCodeScanner
        onScan={(uri) => {
          handleConnect(uri)
          navigation.goBack()
        }}
      />
    </GradientBackgroundWrapper>
  )
}

export default ConnectScreen
