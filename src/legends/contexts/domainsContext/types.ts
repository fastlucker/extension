type CachedDomain = {
  ens: string | null
  ud: string | null
}

type CachedDomains = {
  [address: string]: CachedDomain
}

export type { CachedDomain, CachedDomains }
