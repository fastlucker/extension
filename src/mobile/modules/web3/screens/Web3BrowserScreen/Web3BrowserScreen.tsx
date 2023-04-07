import React, { useRef } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'

import styles from './styles'

const Web3BrowserScreen = () => {
  const webViewRef = useRef(null)
  const route = useRoute()

  // Define a function to handle messages from the injected EthereumProvider
  const handleEthereumProviderMessage = (event) => {
    // Parse the message data
    const { type, payload } = JSON.parse(event.nativeEvent.data)
    console.log(type, payload)
  }

  const selectedDappUrl = route?.params?.selectedDappUrl

  return (
    <>
      <GradientBackgroundWrapper>
        <Wrapper style={spacings.ph0} hasBottomTabNav>
          {!!selectedDappUrl && (
            <WebView
              ref={webViewRef}
              source={{ uri: selectedDappUrl }}
              onMessage={handleEthereumProviderMessage}
              // injectedJavaScript={ethereumProviderScript}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingWrapper}>
                  <Spinner />
                </View>
              )}
              containerStyle={styles.container}
              style={styles.webview}
            />
          )}
        </Wrapper>
      </GradientBackgroundWrapper>
    </>
  )
}

export default Web3BrowserScreen
