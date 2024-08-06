import { DomainsController } from '@ambire-common/controllers/domains/domains'
import { AddressState } from '@ambire-common/interfaces/domains'

const getAddressFromAddressState = (addressState: AddressState) => {
  return (addressState.udAddress || addressState.ensAddress || addressState.fieldValue || '').trim()
}

const findAccountDomainFromPartialDomain = (
  address: string,
  search: string,
  domains: DomainsController['domains']
) => {
  const lowercaseSearch = search.toLowerCase()
  const domainsEntry = domains[address]

  return (
    domainsEntry?.ens?.toLowerCase().includes(lowercaseSearch) ||
    domainsEntry?.ud?.toLowerCase().includes(lowercaseSearch)
  )
}

export { getAddressFromAddressState, findAccountDomainFromPartialDomain }
