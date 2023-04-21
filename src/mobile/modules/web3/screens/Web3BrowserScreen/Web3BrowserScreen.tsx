import networks from 'ambire-common/src/constants/networks'
import { providers } from 'ethers'
import React, { useRef } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import providerController from '@mobile/modules/web3/services/webview-background/provider/provider'
import sessionService from '@mobile/modules/web3/services/webview-background/services/session'
import useGetProviderInjection from '@mobile/modules/web3/services/webview-inpage/injection-script'

import styles from './styles'

const Web3BrowserScreen = () => {
  const webViewRef = useRef(null)
  const route = useRoute()

  const selectedDappUrl = route?.params?.selectedDappUrl

  const providerToInject = useGetProviderInjection()

  // Define a function to handle messages from the injected EthereumProvider
  const handleEthereumProviderMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data)
    console.log('data', data)
    const sessionId = selectedDappUrl
    const origin = selectedDappUrl
    const session = sessionService.getOrCreateSession(sessionId, origin, webViewRef)
    const req = { data, session, origin }
    const result = await providerController(req)
    console.log('result', result)

    const response = {
      id: data.id,
      method: data.method,
      success: true, // or false if there is an error
      result // or error: {} if there is an error
    }

    if (result) {
      webViewRef?.current?.injectJavaScript(`handleProviderResponse(${JSON.stringify(response)});`)
    }
  }

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
