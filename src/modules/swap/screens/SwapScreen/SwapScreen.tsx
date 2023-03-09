import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import WebView from 'react-native-webview'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Spinner from '@common/components/Spinner'
import Wrapper from '@common/components/Wrapper'
import useGnosis from '@common/hooks/useGnosis'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import CONFIG, { isiOS } from '@config/env'

import styles from './styles'

const INJECTED_JAVASCRIPT_BEFORE_CONTENT_LOADED = `(function() {
  document.addEventListener('message', function (msg) {
    document.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
  });

  window.addEventListener('message', (msg) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
  });
})();`

// Scales the webview a little bit, in order for the content to fit
// based on all spacings in our app, and to prevent horizontal scroll.
const WEB_VIEW_SCALE = 1

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
  document.styleSheets[0].insertRule('::selection { background-color: ${colors.hauntedDreams}; }', 0);
`

// Set a better matching the mobile UI tap highlighting color,
// a bit transparent so the elements below gets visible.
// {@link https://stackoverflow.com/a/8092444/1333836}
const HIGHLIGHT_COLOR = `
  document.styleSheets[0].insertRule('* { -webkit-tap-highlight-color: ${colors.vulcan}; }', 0);
`

const INJECTED_JAVASCRIPT = `
  ${DISABLE_ZOOM}
  ${TEXT_SELECTION_COLOR}
  ${HIGHLIGHT_COLOR}
`

// Set the iframe height with 100% and no scroll (Scroll-y in body).
// https://stackoverflow.com/a/5956269/1333836
const INJECTED_WRAPPING_CSS = `
  <style type="text/css" media="screen">
    body, html { width: 100%; height: 100%; overflow: hidden; }

    * { padding: 0; margin: 0; }

    iframe { width: 100%; height: 100%; overflow: hidden; border: none; }
  </style>
`

const SwapScreen = () => {
  const { sushiSwapIframeRef, hash, handleIncomingMessage } = useGnosis()
  const [loaded, setLoaded] = useState<boolean>(false)

  const webviewHtml = useMemo(
    () => `
    <!DOCTYPE html>
      <html>
        <head>${INJECTED_WRAPPING_CSS}</head>
        <body>
          <iframe id=${hash} src="${CONFIG.SWAP_URL}" scrolling="no" allow="autoplay; encrypted-media"></iframe>
        </body>
      </html>
    `,
    [hash]
  )

  const webviewSource = useMemo(() => {
    // Workaround: In order for the webview to load properly SushiSwap on iOS,
    // the url should be loaded first as a uri source
    // and instantly after that as a html(iframe) source.
    if (isiOS) {
      return loaded ? { html: webviewHtml } : { uri: CONFIG.SWAP_URL }
    }

    return { html: webviewHtml }
  }, [loaded, webviewHtml])

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav style={spacings.phTy}>
        {/* Note: this doesn't work on Android emulator. */}
        {/* It displays a blank screen only, no matter if the source is */}
        {/* html or uri. Supposedly, its caused by the SushiSwap html */}
        {/* because it works with other uri-s and it works with custom html */}
        <WebView
          key={hash}
          ref={sushiSwapIframeRef}
          originWhitelist={['*']}
          source={webviewSource}
          injectedJavaScriptForMainFrameOnly
          injectedJavaScriptBeforeContentLoadedForMainFrameOnly
          setSupportMultipleWindows
          javaScriptEnabled
          injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT_BEFORE_CONTENT_LOADED}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          containerStyle={styles.container}
          style={styles.webview}
          bounces={false}
          onLoadEnd={() => {
            if (!loaded) {
              // Just to make sure the url loads first on iOS before the html
              setTimeout(() => {
                setLoaded(true)
              }, 50)
            }
          }}
          setBuiltInZoomControls={false}
          overScrollMode="never" // prevents the Android bounce effect (blue shade when scroll to end)
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingWrapper}>
              <Spinner />
            </View>
          )}
          onMessage={(event) => {
            const msg = JSON.parse(event.nativeEvent.data)
            handleIncomingMessage(msg)
          }}
        />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default SwapScreen
