import React from 'react'
import WebView from 'react-native-webview'

const SwapScreen = () => {
  const htmlStyleFix = `<style type="text/css">
    div {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: stretch;
      height: 100%;
    }
    iframe {
      overflow: auto;
      box-sizing: border-box;
      border: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: stretch;

    }
    </style>`

  const html = `
    ${htmlStyleFix}
    <div>
      <iframe src='https://sushiswap-interface-ten.vercel.app/swap' />
    </div>
  `
  return <WebView originWhitelist={['*']} source={{ html }} />
}

export default SwapScreen
