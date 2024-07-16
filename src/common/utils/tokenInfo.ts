import { NetworkId } from '@ambire-common/interfaces/network'

const CENA_AMBIRE = 'https://cena.ambire.com/api/v3'

export default async function getTokenInfo(address: string, networkId: NetworkId, fetch: Function) {
  try {
    const queryUrl = `${CENA_AMBIRE}/coins/${networkId}/contract/${address}`
    let response = await fetch(queryUrl)
    response = await response.json()
    if (response.symbol && response.detail_platforms?.[networkId]?.decimal_place)
      return {
        symbol: response.symbol.toUpperCase(),
        decimals: response.detail_platforms?.[networkId]?.decimal_place
      }
    return null
  } catch (e: any) {
    return null
  }
}
