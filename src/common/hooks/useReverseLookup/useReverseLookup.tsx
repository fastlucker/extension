import { useEffect } from 'react'

import useBackgroundService from '@web/hooks/useBackgroundService'
import useDomainsControllerState from '@web/hooks/useDomainsController/useDomainsController'

interface Props {
  address: string
}

const useReverseLookup = ({ address }: Props) => {
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

  return {
    isLoading: isLoading || !addressInDomains,
    ens: addressInDomains?.ens,
    ud: addressInDomains?.ud
  }
}

export default useReverseLookup
