import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import WebView from 'react-native-webview'

import Wrapper from '@modules/common/components/Wrapper'
import useGnosis from '@modules/common/hooks/useGnosis'

import styles from './styles'

const ambireSushiConfig = {
  name: 'Ambire swap',
  url: 'https://sushiswap-interface-ten.vercel.app/swap',
  logo: 'https://www.ambire.com/ambire-logo.png',
  desc: 'Ambire swap'
}

const SwapScreen = () => {
  const { sushiSwapIframeRef, hash, handleIncomingMessage } = useGnosis()

  // TODO: Add loading state
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
  }, [hash])

  const INJECTED_JAVASCRIPT = `(function() {
    document.addEventListener('message', function (event) {
      document.ReactNativeWebView.postMessage(JSON.stringify(msg));
    });

    window.addEventListener('message', (msg) => {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
    })
  })();`

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

  return (
    <Wrapper>
      <WebView
        ref={sushiSwapIframeRef}
        originWhitelist={['*']}
        // source={{ html }}
        source={{ uri: 'https://sushiswap-interface-ten.vercel.app/swap' }}
        javaScriptEnabled
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        style={styles.webview}
        bounces={false}
        scrollEnabled={false}
        onMessage={(event) => {
          const msg = JSON.parse(event.nativeEvent.data)
          handleIncomingMessage(msg)
        }}
        // onLoad={() => {
        //   setLoading(false)
        // }}
      />
    </Wrapper>
  )
}

export default SwapScreen
