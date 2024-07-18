const CENA_AMBIRE = 'https://cena.ambire.com/api/v3'

export default async function getTokenInfo(address: string, platformId: string, fetch: Function) {
  try {
    const queryUrl = `${CENA_AMBIRE}/coins/${platformId}/contract/${address}`
    let response = await fetch(queryUrl)
    response = await response.json()
    if (response.symbol && response.detail_platforms?.[platformId]?.decimal_place)
      return {
        symbol: response.symbol.toUpperCase(),
        decimals: response.detail_platforms?.[platformId]?.decimal_place
      }
    return null
  } catch (e: any) {
    return null
  }
}
