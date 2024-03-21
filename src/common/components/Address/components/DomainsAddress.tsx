import { getAddress } from 'ethers'
import React, { FC, useEffect } from 'react'

import Spinner from '@common/components/Spinner'
import { Props as TextProps } from '@common/components/Text'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useDomainsControllerState from '@web/hooks/useDomainsController/useDomainsController'

import BaseAddress from './BaseAddress'

interface Props extends TextProps {
  address: string
}

const DomainsAddress: FC<Props> = ({ address: _address, ...rest }) => {
  const { dispatch } = useBackgroundService()
  const { domains, loadingAddresses } = useDomainsControllerState()
  const checksummedAddress = getAddress(_address)
  const isLoading = loadingAddresses.includes(checksummedAddress)
  const addressInDomains = domains[checksummedAddress]

  useEffect(() => {
    if (!checksummedAddress || addressInDomains || isLoading) return

    dispatch({
      type: 'DOMAINS_CONTROLLER_REVERSE_LOOKUP',
      params: {
        address: checksummedAddress
      }
    })
  }, [checksummedAddress, addressInDomains, dispatch, isLoading])

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
    <BaseAddress address={checksummedAddress} {...rest}>
      {addressInDomains?.ens || addressInDomains?.ud || checksummedAddress}
    </BaseAddress>
  )
}

export default DomainsAddress
