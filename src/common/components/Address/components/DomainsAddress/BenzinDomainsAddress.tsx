/* eslint-disable no-console */
import React, { FC, useEffect, useState } from 'react'

import { networks } from '@ambire-common/consts/networks'
import { reverseLookupEns } from '@ambire-common/services/ensDomains'
import { getRpcProvider } from '@ambire-common/services/provider'
import { reverseLookupUD } from '@ambire-common/services/unstoppableDomains'
import Spinner from '@common/components/Spinner'
import { Props as TextProps } from '@common/components/Text'

import BaseAddress from '../BaseAddress'

interface Props extends TextProps {
  address: string
}

const BenzinDomainsAddress: FC<Props> = ({ address, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [resolvedDomain, setResolvedDomain] = useState<{
    ens: string | null
    ud: string | null
  }>({
    ens: null,
    ud: null
  })
  useEffect(() => {
    const rpcUrls = networks.find(({ id }) => id === 'ethereum')?.rpcUrls

    if (!rpcUrls) return

    const ethereumProvider = getRpcProvider(rpcUrls)

    const resolveDomain = async () => {
      setIsLoading(true)
      let ens = null
      let ud = null

      try {
        if (ethereumProvider.destroyed) return
        ens = await reverseLookupEns(address, ethereumProvider)
      } catch (e: any) {
        if (!e?.message?.includes('cancelled request')) {
          console.error('ENS reverse lookup unexpected error', e)
        }
      }

      try {
        if (ethereumProvider.destroyed) return
        ud = await reverseLookupUD(address)
      } catch (e: any) {
        if (
          !e?.message?.includes('Only absolute URLs are supported') &&
          !e?.message?.includes('cancelled request')
        ) {
          console.error('UD reverse lookup unexpected error', e)
        }
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
  }, [address])

  if (isLoading)
    return (
      <Spinner
        style={{
          width: 16,
          height: 16
        }}
      />
    )

  return (
    <BaseAddress address={address} {...rest}>
      {resolvedDomain.ens || resolvedDomain.ud || address}
    </BaseAddress>
  )
}

export default BenzinDomainsAddress
