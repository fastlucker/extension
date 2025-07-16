import Token from '../interfaces/token'

type TokenSymbol = 'dai' | 'usdc' | 'usdce' | 'wallet' | 'eth' | 'link' | 'wcres' | 'xwallet'
type Network = 'optimism' | 'base' | 'ethereum' | 'arbitrum'

type Tokens = Record<TokenSymbol, Partial<Record<Network, Token>>>

const tokens: Tokens = {
  eth: {
    ethereum: {
      address: '0x0000000000000000000000000000000000000000',
      chainId: '1',
      symbol: 'ETH'
    },
    base: {
      address: '0x0000000000000000000000000000000000000000',
      chainId: '8453',
      symbol: 'ETH'
    }
  },
  wcres: {
    ethereum: {
      address: '0xa0afaa285ce85974c3c881256cb7f225e3a1178a',
      chainId: '1',
      symbol: 'wCRES'
    }
  },
  link: {
    base: {
      address: '0x88fb150bdc53a65fe94dea0c9ba0a6daf8c6e196',
      chainId: '8453',
      symbol: 'LINK'
    }
  },
  dai: {
    optimism: {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      chainId: '10',
      symbol: 'DAI'
    },
    arbitrum: {
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      chainId: '42161',
      symbol: 'DAI'
    }
  },
  usdc: {
    optimism: {
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      chainId: '10',
      symbol: 'USDC'
    },
    base: {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      chainId: '8453',
      symbol: 'USDC'
    },
    ethereum: {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      chainId: '1',
      symbol: 'USDC'
    }
  },
  usdce: {
    optimism: {
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      chainId: '10',
      symbol: 'USDC.E'
    }
  },
  wallet: {
    ethereum: {
      address: '0x88800092ff476844f74dc2fc427974bbee2794ae',
      chainId: '1',
      symbol: 'WALLET'
    },
    base: {
      address: '0x0BbbEad62f7647AE8323d2cb243A0DB74B7C2b80',
      chainId: '8453',
      symbol: 'WALLET'
    }
  },
  xwallet: {
    ethereum: {
      address: '0x47Cd7E91C3CBaAF266369fe8518345fc4FC12935',
      chainId: '1',
      symbol: 'xWALLET'
    }
  }
}

export default tokens
