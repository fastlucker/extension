import Token from '../interfaces/token'

type TokenSymbol = 'dai' | 'usdc' | 'usdce' | 'wallet' | 'eth' | 'link' | 'wcres' | 'xwallet'
type Network = 'optimism' | 'base' | 'ethereum' | 'arbitrum'

type Tokens = Record<TokenSymbol, Partial<Record<Network, Token>>>

const tokens: Tokens = {
  eth: {
    ethereum: {
      address: '0x0000000000000000000000000000000000000000',
      chainId: '1',
      chainName: 'ethereum',
      symbol: 'ETH'
    },
    base: {
      address: '0x0000000000000000000000000000000000000000',
      chainId: '8453',
      chainName: 'base',
      symbol: 'ETH'
    }
  },
  wcres: {
    ethereum: {
      address: '0xa0afAA285Ce85974c3C881256cB7F225e3A1178a',
      chainId: '1',
      chainName: 'ethereum',
      symbol: 'wCRES'
    }
  },
  link: {
    base: {
      address: '0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196',
      chainId: '8453',
      chainName: 'base',
      symbol: 'LINK'
    }
  },
  dai: {
    optimism: {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      chainId: '10',
      chainName: 'optimism',
      symbol: 'DAI'
    },
    arbitrum: {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      chainId: '42161',
      chainName: 'arbitrum',
      symbol: 'DAI'
    }
  },
  usdc: {
    optimism: {
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      chainId: '10',
      chainName: 'optimism',
      symbol: 'USDC'
    },
    base: {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      chainId: '8453',
      chainName: 'base',
      symbol: 'USDC'
    },
    ethereum: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chainId: '1',
      chainName: 'ethereum',
      symbol: 'USDC'
    }
  },
  usdce: {
    optimism: {
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      chainId: '10',
      chainName: 'optimism',
      symbol: 'USDC.E'
    }
  },
  wallet: {
    ethereum: {
      address: '0x88800092fF476844f74dC2FC427974BBee2794Ae',
      chainId: '1',
      chainName: 'ethereum',
      symbol: 'WALLET'
    },
    base: {
      address: '0x0BbbEad62f7647AE8323d2cb243A0DB74B7C2b80',
      chainId: '8453',
      chainName: 'base',
      symbol: 'WALLET'
    }
  },
  xwallet: {
    ethereum: {
      address: '0x47Cd7E91C3CBaAF266369fe8518345fc4FC12935',
      chainId: '1',
      chainName: 'ethereum',
      symbol: 'xWALLET'
    }
  }
}

export default tokens
