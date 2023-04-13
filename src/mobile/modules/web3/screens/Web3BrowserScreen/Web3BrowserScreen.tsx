import networks from 'ambire-common/src/constants/networks'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
// import injectionScript from '@mobile/modules/web3/services/webview-inpage/injection'
import EthereumProvider from '@mobile/modules/web3/services/webview-inpage/EthereumProvider'
import { DAPP_PROVIDER_URLS } from '@web/extension-services/inpage/config/dapp-providers'

import styles from './styles'

const provider = new EthereumProvider({ networks, DAPP_PROVIDER_URLS })

const realProvider = `
  alert('Provider injected!')

  window.ethereum = {
    request: function (args) {
      // Send a message to the React Native side
      window.ReactNativeWebView.postMessage(JSON.stringify(args));
      return new Promise((resolve, reject) => {
        // Handle the response from the React Native side
        window.addEventListener("message", function (event) {
          const response = JSON.parse(event.data);
          if (response.success) {
            resolve(response.result);
          } else {
            reject(response.error);
          }
        });
      });
    },
  };

  true;
`

const dummyProvider = `
  alert('Dummy provider injected!')
  window.ReactNativeWebView = window.ReactNativeWebView || {};

  window.ReactNativeWebView.postMessage = function (message) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  };

  function handleRequest(args) {
    alert('Request received: ' + JSON.stringify(args));
    switch (args.method) {
      case 'eth_accounts':
        return ['0x742d35Cc6634C0532925a3b844Bc454e4438f44e'];
      default:
        throw new Error('Method not supported: ' + args.method);
    }
  }

  const customProvider = {
    isMetaMask: false,
    isConnected: function () {
      return true
    },
    request: async function (args) {
      switch (args.method) {
        case 'eth_accounts':
          return ['0xdd2a7Dc3d038b5EA4164D41B3617aDa5eb4179bf']
        case 'eth_chainId':
          return '0x1'
        case 'net_version':
          return '1'
        case 'eth_requestAccounts':
          return ['0xdd2a7Dc3d038b5EA4164D41B3617aDa5eb4179bf']
        case 'personal_sign':
          return '0xYourSignedMessage'
        case 'eth_sendTransaction':
          return '0xYourTransactionHash'
        // Add more methods as needed
        default:
          throw new Error('Method ' + args.method + ' not supported')
      }
    }
  };

  window.ethereum = customProvider;
  true;
`

const Web3BrowserScreen = () => {
  const [scriptToInject, setScriptToInject] = useState<any>(null)

  const webViewRef = useRef(null)
  const route = useRoute()
  const { goBack } = useNavigation()
  const { addToast } = useToast()

  useEffect(() => {}, [])

  // Define a function to handle messages from the injected EthereumProvider
  const handleEthereumProviderMessage = async (event) => {
    const request = JSON.parse(event.nativeEvent.data)
    console.log('request', request)

    // Interact with your EthereumProvider instance and get the response
    // TODO: Figure out why this hangs.
    const response = await provider.request(request)

    console.log('response', response)

    // TODO: Send the response back to the WebView
    webViewRef?.current?.postMessage(JSON.stringify(response))
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
            injectedJavaScriptBeforeContentLoaded={realProvider}
            // injectedJavaScriptBeforeContentLoaded={dummyProvider}
            // TODO:
            // injectedJavaScript={scriptToInject}
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
