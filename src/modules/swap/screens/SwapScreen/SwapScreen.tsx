import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import WebView from 'react-native-webview'

import CONFIG from '@config/env'
import Wrapper from '@modules/common/components/Wrapper'
import useGnosis from '@modules/common/hooks/useGnosis'

import styles from './styles'

const INJECTED_JAVASCRIPT_BEFORE_CONTENT_LOADED = `(function() {
  document.addEventListener('message', function (event) {
    document.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
  });

  window.addEventListener('message', (msg) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
  });
})();`

// Disables zoom in and pinch on the WebView for iOS
// {@link https://stackoverflow.com/a/49121982/1333836}
const INJECTED_JAVASCRIPT = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
  meta.setAttribute('name', 'viewport');
  document.head.appendChild(meta);
`

const SwapScreen = () => {
  const { sushiSwapIframeRef, hash, handleIncomingMessage } = useGnosis()

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
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT_BEFORE_CONTENT_LOADED}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        containerStyle={styles.container}
        style={styles.webview}
        bounces={false}
        scrollEnabled={false}
        setBuiltInZoomControls={false}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#fff" />
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
