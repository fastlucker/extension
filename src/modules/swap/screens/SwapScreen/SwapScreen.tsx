import React, { useEffect } from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'
import WebView from 'react-native-webview'

import CONFIG from '@config/env'
import Wrapper from '@modules/common/components/Wrapper'
import useGnosis from '@modules/common/hooks/useGnosis'
import colors from '@modules/common/styles/colors'
import { useIsFocused } from '@react-navigation/native'

import styles from './styles'

const INJECTED_JAVASCRIPT_BEFORE_CONTENT_LOADED = `(function() {
  document.addEventListener('message', function (event) {
    document.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
  });

  window.addEventListener('message', (msg) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
  });
})();`

// Scales the webview a little bit, in order for the content to fit
// based on all spacings in our app, and to prevent horizontal scroll.
const WEB_VIEW_SCALE = 0.85

// Disables zoom in and pinch on the WebView for iOS
// {@link https://stackoverflow.com/a/49121982/1333836}
const DISABLE_ZOOM = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=${WEB_VIEW_SCALE}, maximum-scale=${WEB_VIEW_SCALE}, user-scalable=0');
  meta.setAttribute('name', 'viewport');
  document.head.appendChild(meta);
`

// Set a better matching the mobile UI text selection color
// {@link https://stackoverflow.com/a/311437/1333836}
const TEXT_SELECTION_COLOR = `
  document.styleSheets[0].insertRule('::selection { background-color: ${colors.backgroundColor}; }', 0);
`

// Set a better matching the mobile UI tap highlighting color,
// a bit transparent so the elements below gets visible.
// {@link https://stackoverflow.com/a/8092444/1333836}
const HIGHLIGHT_COLOR = `
  document.styleSheets[0].insertRule('* { -webkit-tap-highlight-color: ${colors.secondaryButtonContainerColor}; }', 0);
`

// The switch tokens button has animation, that gets triggered via
// `onMouseEnter` and `onMouseLeave` events (animated SVG).
// These events however, on tap, trigger the animation, but don't fire
// the actual event that switches token positions.
// Therefore, turn off the `onMouseEnter` and `onMouseLeave` events with CSS
// so that the button always fires the logic when tapped.
const DISABLE_SWITCH_TOKENS_ANIMATION = `
  document.styleSheets[0].insertRule('.bg-ambire-input-background { pointer-events: none; }', 0);
`

const INJECTED_JAVASCRIPT = `
  ${DISABLE_ZOOM}
  ${TEXT_SELECTION_COLOR}
  ${HIGHLIGHT_COLOR}
  ${DISABLE_SWITCH_TOKENS_ANIMATION}
`

const SwapScreen = () => {
  const { sushiSwapIframeRef, hash, handleIncomingMessage } = useGnosis()
  const isFocused = useIsFocused()

  // Reload webview when entering the screen because of some strange webview caching on Android
  useEffect(() => {
    if (isFocused && Platform.OS === 'android') {
      sushiSwapIframeRef.current?.reload()
    }
  }, [isFocused])

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
        setBuiltInZoomControls={false}
        overScrollMode="never" // prevents the Android bounce effect (blue shade when scroll to end)
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
