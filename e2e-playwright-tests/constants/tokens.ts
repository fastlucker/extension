import Token from '../interfaces/token'

type TokenSymbol = 'dai' | 'usdc' | 'usdce' | 'wallet'
type Network = 'optimism' | 'base' | 'ethereum'

type Tokens = Record<TokenSymbol, Partial<Record<Network, Token>>>

const tokens: Tokens = {
  dai: {
    optimism: {
      address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
      chainId: '10',
      symbol: 'DAI'
    }
  },
  usdc: {
    optimism: {
      address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      chainId: '10',
      symbol: 'USDC'
    },
    base: {
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
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
      address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      chainId: '10',
      symbol: 'USDC.e'
    }
  },
  wallet: {
    base: {
      address: '0x0bbbead62f7647ae8323d2cb243a0db74b7c2b80',
      chainId: '8453',
      symbol: 'WALLET'
    }
  }
}

export default tokens
