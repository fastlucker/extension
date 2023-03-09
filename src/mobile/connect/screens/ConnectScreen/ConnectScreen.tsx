import React from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import QRCodeScanner from '@common/components/QRCodeScanner'
import useIsScreenFocused from '@common/hooks/useIsScreenFocused'
import useNavigation from '@common/hooks/useNavigation'
import useWalletConnect from '@common/hooks/useWalletConnect'

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
