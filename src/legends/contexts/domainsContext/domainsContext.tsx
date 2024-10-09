import React, { createContext, useCallback, useMemo, useState } from 'react'

import { CachedDomain, CachedDomains } from './types'

const DomainsContext = createContext<{
  cachedDomains: CachedDomains
  cacheDomain: (address: string, domain: CachedDomain) => void
}>({
  cachedDomains: {},
  cacheDomain: () => {}
})

const DomainsContextProvider: React.FC<any> = ({ children }) => {
  const [cachedDomains, setCachedDomains] = useState<CachedDomains>({})

  const cacheDomain = useCallback(
    (address: string, domain: CachedDomain) => {
      if (cachedDomains[address]) return

      setCachedDomains((prev) => ({
        ...prev,
        [address]: domain
      }))
    },
    [cachedDomains]
  )

  const value = useMemo(
    () => ({
      cachedDomains,
      cacheDomain
    }),
    [cachedDomains, cacheDomain]
  )

  return <DomainsContext.Provider value={value}>{children}</DomainsContext.Provider>
}

export { DomainsContextProvider, DomainsContext }
