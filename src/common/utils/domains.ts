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
  const allDomains = Object.values(domains).map((domain) => domain.ens || domain.ud)
  const matchingDomains = allDomains.filter((domain) =>
    domain?.toLowerCase().includes(search.toLowerCase())
  )

  const doesDomainMatch = matchingDomains.some(
    (domain) => domains[address]?.ens === domain || domains[address]?.ud === domain
  )

  return doesDomainMatch
}

export { getAddressFromAddressState, findAccountDomainFromPartialDomain }
