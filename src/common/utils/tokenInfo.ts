const CENA_AMBIRE = 'https://cena.ambire.com/api/v3'

// will not cache the results across different sessions
const tokenInfoCache: { [key: string]: { decimals: number; symbol: string } } = {}
export default async function getTokenInfo(address: string, platformId: string, fetch: Function) {
  if (tokenInfoCache[`${platformId}:${address}`]) return tokenInfoCache[`${platformId}:${address}`]
  try {
    const queryUrl = `${CENA_AMBIRE}/coins/${platformId}/contract/${address}`
    let response = await fetch(queryUrl)
    response = await response.json()
    if (response.symbol && response.detail_platforms?.[platformId]?.decimal_place) {
      const res = {
        symbol: response.symbol.toUpperCase(),
        decimals: response.detail_platforms?.[platformId]?.decimal_place
      }
      tokenInfoCache[`${platformId}:${address}`] = res
      return res
    }
    throw new Error('we failed to find the token')
  } catch (e: any) {
    throw new Error(`Could not fetch token info: ${e.message}`)
  }
}
