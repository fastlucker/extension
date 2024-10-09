import { useEffect, useState } from 'react'

import { networks } from '@ambire-common/consts/networks'
import { reverseLookupEns } from '@ambire-common/services/ensDomains'
import { getRpcProvider } from '@ambire-common/services/provider'
import { reverseLookupUD } from '@ambire-common/services/unstoppableDomains'

type Props = {
  address: string
  disable?: ('ens' | 'ud')[]
  cache?: {
    [address: string]: { ens: string | null; ud: string | null }
  }
  cacheCallback?: (
    address: string,
    resolvedDomain: { ens: string | null; ud: string | null }
  ) => void
}

const useStandaloneReverseLookup = ({ address, disable, cache, cacheCallback }: Props) => {
  const cachedEntry = cache?.[address]
  const [isLoading, setIsLoading] = useState(!cachedEntry)
  const [resolvedDomain, setResolvedDomain] = useState<{
    ens: string | null
    ud: string | null
  }>(
    cachedEntry || {
      ens: null,
      ud: null
    }
  )

  useEffect(() => {
    if (cachedEntry) return

    const network = networks.find(({ id }) => id === 'ethereum')

    if (!network) return

    const ethereumProvider = getRpcProvider(network.rpcUrls, network.chainId)

    const resolveDomain = async () => {
      setIsLoading(true)
      let ens = null
      let ud = null

      if (!disable?.includes('ens')) {
        try {
          if (ethereumProvider.destroyed) return
          ens = await reverseLookupEns(address, ethereumProvider)
        } catch (e: any) {
          if (!e?.message?.includes('cancelled request')) {
            console.error('ENS reverse lookup unexpected error', e)
          }
        }
      }

      if (!disable?.includes('ud')) {
        try {
          if (ethereumProvider.destroyed || disable?.includes('ud')) return
          ud = await reverseLookupUD(address)
        } catch (e: any) {
          if (
            !e?.message?.includes('Only absolute URLs are supported') &&
            !e?.message?.includes('cancelled request')
          ) {
            console.error('UD reverse lookup unexpected error', e)
          }
        }
      }

      if (cacheCallback) {
        cacheCallback(address, {
          ens,
          ud
        })
      }

      setResolvedDomain({
        ens,
        ud
      })
      setIsLoading(false)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    resolveDomain()

    return () => {
      ethereumProvider.destroy()
    }
  }, [address, cacheCallback, cachedEntry, disable])

  return {
    isLoading,
    resolvedDomain
  }
}

export default useStandaloneReverseLookup
