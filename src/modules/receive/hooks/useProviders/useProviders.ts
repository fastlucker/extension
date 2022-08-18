import { NetworkId } from 'ambire-common/src/constants/networks'
import { FC } from 'react'
import url from 'url'

import PayTrieLogo from '@assets/svg/PayTrieLogo'
import RampLogo from '@assets/svg/RampLogo'
import TransakLogo from '@assets/svg/TransakLogo'
import CONFIG from '@config/env'
import { useNavigation } from '@react-navigation/native'

type UseProvidersProps = {
  walletAddress: string
  networkId: NetworkId
}

type UseProvidersReturnType = {
  providers: {
    Icon: FC<any>
    name: string
    type: string
    fees: string
    limits: string
    currencies: string
    networks: string[]
    onClick: () => void
  }[]
}

type NavigateProp = (
  route: 'provider',
  params: {
    name: string
    uri: string
  }
) => void

const { RAMP_HOST_API_KEY, PAYTRIE_PARTNER_URL, TRANSAK_API_KEY, TRANSAK_ENV } = CONFIG

const useProviders = ({ walletAddress, networkId }: UseProvidersProps): UseProvidersReturnType => {
  const { navigate }: { navigate: NavigateProp } = useNavigation()

  const openRampNetwork = (name: string) => {
    const assetsList: { [key in NetworkId]?: string } = {
      ethereum: 'ERC20_*,ETH_*',
      polygon: 'MATIC_ERC20_*,MATIC_*',
      avalanche: 'AVAX_*',
      'binance-smart-chain': 'BSC_*,BSC_ERC20_*',
      gnosis: 'XDAI_*'
    }

    navigate('provider', {
      name,
      uri: `https://buy.ramp.network/?userAddress=${walletAddress}&hostApiKey=${RAMP_HOST_API_KEY}&swapAsset=${assetsList[networkId]}&finalUrl=ambire://&hostAppName=Ambire&hostLogoUrl=https://www.ambire.com/ambire-logo.png`
    })
  }

  const openPayTrie = (name: string) => {
    const rightSideLabels: { [key in NetworkId]?: string } = {
      ethereum: 'USDC',
      polygon: 'USDC-P',
      'binance-smart-chain': 'USDT-B'
    }

    const URL = url.parse(PAYTRIE_PARTNER_URL, true)
    URL.search = null
    URL.query = {
      ...URL.query,
      addr: walletAddress,
      rightSideLabel: rightSideLabels[networkId]
    }

    navigate('provider', {
      name,
      uri: url.format(URL)
    })
  }

  const openTransak = (name: string) => {
    const baseURL =
      TRANSAK_ENV === 'PRODUCTION'
        ? 'https://global.transak.com?'
        : 'https://staging-global.transak.com'

    const networksAlias: { [key in NetworkId]?: string } = {
      avalanche: 'avaxcchain',
      'binance-smart-chain': 'bsc',
      moonbeam: 'mainnet'
    }

    const defaultCurrency: { [key in NetworkId]?: string } = {
      polygon: 'USDC',
      arbitrum: 'ETH',
      avalanche: 'AVAX',
      'binance-smart-chain': 'BNB',
      moonriver: 'MOVR',
      moonbeam: 'GLMR',
      optimism: 'USDC'
    }

    navigate('provider', {
      name,
      uri: `${baseURL}?apiKey=${TRANSAK_API_KEY}&themeColor=282b33&disableWalletAddressForm=true&networks=${
        networksAlias[networkId] || networkId
      }&defaultCryptoCurrency=${defaultCurrency[networkId]}&walletAddress=${walletAddress}`
    })
  }

  const providers = [
    {
      Icon: RampLogo,
      name: 'Ramp',
      type: 'Bank Transfer, Credit/Debit Card, Apple Pay',
      fees: '0.49%-2.9%',
      limits: '10,000EUR/m',
      currencies: 'USD, EUR, GBP',
      networks: ['ethereum', 'polygon', 'avalanche', 'binance-smart-chain', 'gnosis'],
      onClick: () => openRampNetwork('Ramp')
    },
    {
      Icon: PayTrieLogo,
      name: 'PayTrie',
      type: 'Bank Transfer',
      fees: '1% (min. $2 CAD)',
      limits: '$2,000CAD/day',
      currencies: 'CAD',
      networks: ['ethereum', 'polygon', 'binance-smart-chain'],
      onClick: () => openPayTrie('PayTrie')
    },
    {
      Icon: TransakLogo,
      name: 'Transak',
      type: 'Credit/Debit card & Bank Transfer (depends on location)',
      fees: 'from 0.5%',
      limits: 'up to 15,000 EUR/day',
      currencies: 'GBP, EUR, USD and many more',
      networks: [
        'ethereum',
        'polygon',
        'avalanche',
        'arbitrum',
        'binance-smart-chain',
        'moonriver',
        'moonbeam',
        'optimism'
      ],
      onClick: () => openTransak('Transak')
    }
  ]

  return {
    providers
  }
}

export default useProviders
