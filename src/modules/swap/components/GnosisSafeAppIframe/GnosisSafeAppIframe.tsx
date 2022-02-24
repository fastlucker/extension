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

  const htmlStyleFix = `
    <style type="text/css">
    div {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: stretch;
      height: 100%;
      background-color: ${colors.backgroundColor}
    }
    iframe {
      overflow: auto;
      box-sizing: border-box;
      border: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: stretch;
      background-color: ${colors.backgroundColor}
    }
    </style>
  `

  const html = `
    ${htmlStyleFix}
    <div>
      <iframe
        id=${hash}
        key=${hash}
        src=${url}
        title=${title}
      />
    </div>
  `

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={{ backgroundColor: colors.backgroundColor }}
    />
  )
}

export default GnosisSafeAppIframe
