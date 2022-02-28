import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import WebView from 'react-native-webview'

import CONFIG from '@config/env'
import Wrapper from '@modules/common/components/Wrapper'
import useGnosis from '@modules/common/hooks/useGnosis'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const SwapScreen = () => {
  const { sushiSwapIframeRef, hash, handleIncomingMessage } = useGnosis()

  const INJECTED_JAVASCRIPT = `(function() {
    document.addEventListener('message', function (event) {
      document.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
    });

    window.addEventListener('message', (msg) => {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
    })
  })();`

  return (
    <Wrapper>
      <WebView
        key={hash}
        ref={sushiSwapIframeRef}
        originWhitelist={['*']}
        source={{
          uri: CONFIG.SUSHI_SWAP_URL
        }}
        javaScriptEnabled
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        containerStyle={flexboxStyles.flex1}
        style={styles.webview}
        bounces={false}
        scrollEnabled={false}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" />
          </View>
        )}
        onMessage={(event) => {
          const msg = JSON.parse(event.nativeEvent.data)
          handleIncomingMessage(msg)
        }}
      />
    </Wrapper>
  )
}

export default SwapScreen

// In case an iframe is needed in the future
// const htmlStyleFix = `
//   <style type="text/css">
//   div {
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//     align-items: stretch;
//     height: 100%;
//     background-color: ${colors.backgroundColor}
//   }
//   iframe {
//     overflow: auto;
//     box-sizing: border-box;
//     border: 0;
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//     align-items: stretch;
//     background-color: ${colors.backgroundColor}
//   }
//   </style>
// `

// const html = `
//   <div>
//     <iframe
//       id=${hash}
//       key=${hash}
//       src=${ambireSushiConfig.url}
//       title="Ambire Plugin"
//     />
//   </div>
// `

// source={{ html }}
