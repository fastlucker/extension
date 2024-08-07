import { Network } from '@ambire-common/interfaces/network'
import { ChainlistNetwork } from '@benzin/screens/BenzinScreen/interfaces/networks'

const convertToAmbireNetworkFormat = async (network: ChainlistNetwork): Promise<Network> => {
  const rpcUrls = network.rpc.filter((rpcUrl: string) => {
    const isHttpOrHttps = rpcUrl.startsWith('http')

    if (!isHttpOrHttps) return false

    const isApiKeyRequired = /${.+}/.test(rpcUrl)

    return !isApiKeyRequired
  })
  let platformId = null
  let nativeAssetId = null

  try {
    const coingeckoRequest = await fetch(
      `https://cena.ambire.com/api/v3/platform/${Number(network.chainId)}`
    ).catch(() => ({
      error: 'currently, we cannot fetch the coingecko information'
    }))

    // set the coingecko info

    if (!('error' in coingeckoRequest)) {
      const coingeckoInfo = await coingeckoRequest.json()
      if (!coingeckoInfo.error) {
        platformId = coingeckoInfo.platformId
        nativeAssetId = coingeckoInfo.nativeAssetId
      }
    }
  } catch {
    // do nothing
  }

  return {
    id: network.name.toLowerCase(),
    name: network.name,
    chainId: BigInt(network.chainId),
    rpcUrls,
    explorerUrl: network.explorers[0].url,
    selectedRpcUrl: rpcUrls[0] || '',
    platformId,
    nativeAssetId,
    nativeAssetSymbol: network.nativeCurrency.symbol,
    // Not needed for benzin
    hasRelayer: false,
    rpcNoStateOverride: false, // TODO
    reestimateOn: 0,
    areContractsDeployed: false, // TODO
    features: [],
    feeOptions: { is1559: false },
    flagged: false,
    hasSingleton: false,
    iconUrls: [],
    erc4337: { enabled: false, hasPaymaster: false },
    isSAEnabled: false,
    predefined: false
  }
}

export { convertToAmbireNetworkFormat }
