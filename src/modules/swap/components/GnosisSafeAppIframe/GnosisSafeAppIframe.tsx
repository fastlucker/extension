import React, { useEffect, useRef, useState } from 'react'
import WebView from 'react-native-webview'

import colors from '@modules/common/styles/colors'

function GnosisSafeAppIframe({
  selectedApp = {},
  title = 'Ambire Plugin',
  network,
  selectedAcc,
  gnosisConnect,
  gnosisDisconnect
}: any) {
  const { chainId } = network || {}
  const { url } = selectedApp || {}
  const [loading, setLoading] = useState(false)
  const [hash, setHash] = useState('')
  const iframeRef = useRef(null)

  useEffect(() => {
    const newHash = url + chainId + selectedAcc
    setHash(newHash)
  }, [chainId, selectedAcc, url])

  useEffect(() => {
    setLoading(true)
  }, [hash])

  useEffect(() => {
    gnosisConnect({
      selectedAcc,
      iframeRef,
      app: selectedApp
    })

    return () => {
      gnosisDisconnect()
    }
  }, [selectedApp, network, selectedAcc, iframeRef, gnosisConnect, gnosisDisconnect])

  const INJECTED_JAVASCRIPT = `(function() {
    document.addEventListener('message', function (event) {
      document.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
    });

    window.addEventListener('message', (msg) => {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg.data));
    })
  })();`

  return (
    <WebView
      originWhitelist={['*']}
      source={{ uri: 'https://sushiswap-interface-ten.vercel.app/swap' }}
      javaScriptEnabled
      injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
      style={{ backgroundColor: colors.backgroundColor }}
      bounces={false}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data)
        console.log('message', data)
      }}
    />
  )
}

export default GnosisSafeAppIframe
