type NetworkFeature = {
  name: string
}

type NativeCurrency = {
  name: string
  symbol: string
  decimals: number
}

type ENS = {
  registry: string
}

type Explorer = {
  name: string
  url: string
  standard: string
  icon?: string // icon is optional as it is not present in every explorer object
}

type ChainlistNetwork = {
  name: string
  chain: string
  icon: string
  rpc: string[]
  features: NetworkFeature[]
  faucets: string[]
  nativeCurrency: NativeCurrency
  infoURL: string
  shortName: string
  chainId: number
  networkId: number
  slip44: number
  ens: ENS
  explorers: Explorer[]
}

export type { ChainlistNetwork }
