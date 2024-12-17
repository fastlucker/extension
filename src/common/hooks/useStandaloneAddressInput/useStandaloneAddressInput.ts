import { useCallback, useState } from 'react'

import { AddressState, AddressStateOptional } from '@ambire-common/interfaces/domains'

import useDomainsContext from '../useDomainsContext'

const useStandaloneAddressInput = () => {
  const { domainsCtrl } = useDomainsContext()
  const [addressState, setAddressState] = useState<AddressState>({
    isDomainResolving: false,
    fieldValue: '',
    ensAddress: '',
    udAddress: ''
  })
  const setAddressStateKeyValue = useCallback((newState: AddressStateOptional) => {
    Object.keys(newState).forEach((key) => {
      // @ts-ignore
      setAddressState((prev) => ({ ...prev, [key]: newState[key] }))
    })
  }, [])
  const handleCacheResolvedDomain = useCallback(
    (address: string, domain: string, type: 'ens' | 'ud') => {
      domainsCtrl.saveResolvedReverseLookup({ address, name: domain, type })
    },
    [domainsCtrl]
  )

  return {
    addressState,
    setAddressState,
    setAddressStateKeyValue,
    handleCacheResolvedDomain,
    address: addressState.ensAddress || addressState.udAddress || addressState.fieldValue
  }
}

export default useStandaloneAddressInput
