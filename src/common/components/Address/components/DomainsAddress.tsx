import React, { FC, useEffect } from 'react'

import Spinner from '@common/components/Spinner'
import { Props as TextProps } from '@common/components/Text'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useDomainsControllerState from '@web/hooks/useDomainsController/useDomainsController'

import BaseAddress from './BaseAddress'

interface Props extends TextProps {
  address: string
}

const DomainsAddress: FC<Props> = ({ address, ...rest }) => {
  const { dispatch } = useBackgroundService()
  const { domains, loadingAddresses } = useDomainsControllerState()
  const isLoading = loadingAddresses.includes(address)
  const addressInDomains = domains[address]

  useEffect(() => {
    if (!address || addressInDomains || isLoading) return

    dispatch({
      type: 'DOMAINS_CONTROLLER_REVERSE_LOOKUP',
      params: {
        address
      }
    })
  }, [address, addressInDomains, dispatch, isLoading])

  if (isLoading || !domains[address])
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
      {addressInDomains?.ens || addressInDomains?.ud || address}
    </BaseAddress>
  )
}

export default DomainsAddress
