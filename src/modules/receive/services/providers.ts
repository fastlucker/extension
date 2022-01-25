import { Linking } from 'react-native'
import url from 'url'

import CONFIG from '@config/env'
import RampSdk from '@ramp-network/react-native-sdk'

const { RAMP_HOST_API_KEY, PAYTRIE_PARTNER_URL, TRANSAK_API_KEY, TRANSAK_ENV } = CONFIG

export const openRampNetwork = ({ walletAddress, selectedNetwork }: any) => {
  const assetsList: any = {
    ethereum: 'ERC20_*,ETH_*',
    polygon: 'MATIC_ERC20_*,MATIC_*',
    avalanche: 'AVAX_*',
    'binance-smart-chain': 'BSC_*,BSC_ERC20_*'
  }

  const ramp = new RampSdk({
    hostAppName: 'Ambire',
    hostLogoUrl: 'https://www.ambire.com/ambire-logo.png',
    hostApiKey: RAMP_HOST_API_KEY,
    userAddress: walletAddress,
    swapAsset: assetsList[selectedNetwork],
    variant: 'auto'
  }).on('*', (event) => {
    console.log("RampSdk.on('*')", event)
  })

  ramp.show()
}

export const openPayTrie = ({ walletAddress, selectedNetwork }: any) => {
  const rightSideLabels: any = {
    ethereum: 'USDC',
    polygon: 'USDC-P',
    'binance-smart-chain': 'USDT-B'
  }

  const URL = url.parse(PAYTRIE_PARTNER_URL, true)
  URL.search = null
  URL.query = {
    ...URL.query,
    addr: walletAddress,
    rightSideLabel: rightSideLabels[selectedNetwork]
  }

  // popupCenter({
  //   url: url.format(URL),
  //   title: 'Paytrie Deposit',
  //   w: 450,
  //   h: 700
  // })
}

export const openTransak = ({ walletAddress, selectedNetwork }: any) => {
  const baseURL =
    TRANSAK_ENV === 'PRODUCTION'
      ? 'https://global.transak.com?'
      : 'https://staging-global.transak.com'

  const networksAlias: any = {
    avalanche: 'avaxcchain',
    'binance-smart-chain': 'bsc'
  }

  const defaultCurency: any = {
    ethereum: 'USDC',
    polygon: 'USDC',
    arbitrum: 'ETH',
    avalanche: 'AVAX',
    'binance-smart-chain': 'BNB'
  }

  Linking.openURL(
    `${baseURL}?apiKey=${TRANSAK_API_KEY}&themeColor=282b33&disableWalletAddressForm=true&networks=${
      networksAlias[selectedNetwork] || selectedNetwork
    }&defaultCryptoCurrency=${defaultCurency[selectedNetwork]}&walletAddress=${walletAddress}`
  )
}
