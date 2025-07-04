function categorizeRequests(requests: string[]) {
  const thirdPartyAllowlist = [
    'https://api.github.com/repos/MetaMask/eth-phishing-detect/contents/src/config.json?ref=main',
    'https://api.github.com/repos/phantom/blocklist/contents/blocklist.yaml?ref=master',
    'https://raw.githubusercontent.com/phantom/blocklist/master/blocklist.yaml',
    'https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/main/src/config.json',
    'https://li.quest/v1/tokens?chains=8453&chainTypes=EVM'
  ]

  return requests.reduce(
    (acc, urlStr) => {
      const url = new URL(urlStr)
      const isAmbire = url.hostname.endsWith('.ambire.com')
      const isThirdPartyAllowed = thirdPartyAllowlist.includes(urlStr)

      if (url.hostname === 'relayer.ambire.com' && url.pathname.includes('/multi-hints')) {
        acc.hints.push(urlStr)
      } else if (url.hostname === 'cena.ambire.com' && url.pathname.includes('/simple/price')) {
        acc.nativePrices.push(urlStr)
      } else if (
        url.hostname === 'cena.ambire.com' &&
        url.pathname.includes('/simple/token_price')
      ) {
        acc.batchedPrices.push(urlStr)
      } else if (url.hostname === 'invictus.ambire.com') {
        acc.rpc.push(urlStr)
      } else if (isThirdPartyAllowed) {
        acc.thirdParty.push(urlStr)
      } else if (isAmbire) {
        acc.allowedUncategorized.push(urlStr)
      } else {
        acc.uncategorized.push(urlStr)
      }

      return acc
    },
    {
      // Allowed requests
      nativePrices: [],
      batchedPrices: [],
      hints: [],
      rpc: [],
      thirdParty: [], // Explicitly whitelisted third-party URLs
      allowedUncategorized: [], // Ambire domains not matched by any known category

      // Uncategorized requests – should normally be empty; review carefully if any appear
      uncategorized: []
    }
  )
}

export { categorizeRequests }
