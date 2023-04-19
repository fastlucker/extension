import networks from 'ambire-common/src/constants/networks'
import React, { useRef } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import useGetProviderInjection from '@mobile/modules/web3/services/webview-inpage/injection-script'

import styles from './styles'

const Web3BrowserScreen = () => {
  const webViewRef = useRef(null)
  const route = useRoute()

  const providerToInject = useGetProviderInjection()

  // Define a function to handle messages from the injected EthereumProvider
  const handleEthereumProviderMessage = async (event) => {
    const request = JSON.parse(event.nativeEvent.data)
    console.log('request', request)

    // Interact with your EthereumProvider instance and get the response
    // TODO: Figure out why this hangs.
    // const response = await provider.request(request)

    // console.log('response', response)

    // TODO: Send the response back to the WebView
    // webViewRef?.current?.injectJavaScript(
    //   `window.dispatchEvent(new MessageEvent('message', { data: '${JSON.stringify(response)}' }));`
    // )
  }

  const selectedDappUrl = route?.params?.selectedDappUrl

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.ph0} hasBottomTabNav>
        {!!selectedDappUrl && (
          <WebView
            ref={webViewRef}
            source={{ uri: selectedDappUrl }}
            onMessage={handleEthereumProviderMessage}
            injectedJavaScriptBeforeContentLoaded={providerToInject}
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
  )
}

export default Web3BrowserScreen
