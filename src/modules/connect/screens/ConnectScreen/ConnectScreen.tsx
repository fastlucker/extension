import React from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import QRCodeScanner from '@modules/common/components/QRCodeScanner'
import useIsScreenFocused from '@modules/common/hooks/useIsScreenFocused'
import useNavigation from '@modules/common/hooks/useNavigation'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'

const ConnectScreen = () => {
  const isFocused = useIsScreenFocused()
  const navigation = useNavigation()
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
