import url from 'url'

import CONFIG from '@config/env'
import RampSdk from '@ramp-network/react-native-sdk'
// @ts-ignore
import transakSDK from '@transak/transak-sdk'

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

  // eslint-disable-next-line new-cap
  const transak = new transakSDK({
    apiKey: TRANSAK_API_KEY,
    environment: TRANSAK_ENV,
    networks: networksAlias[selectedNetwork] || selectedNetwork,
    defaultCryptoCurrency: defaultCurency[selectedNetwork],
    disableWalletAddressForm: true,
    walletAddress,
    themeColor: '282b33',
    email: '',
    redirectURL: '',
    // hostURL: window.location.origin,
    widgetHeight: 'calc(100% - 60px)',
    widgetWidth: '100%'
  })

  transak.init()

  transak.on(transak.ALL_EVENTS, (data: any) => {
    console.log(data)
  })

  transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData: any) => {
    console.log(orderData)
    transak.close()
  })
}
