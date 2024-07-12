import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { findAccountDomainFromPartialDomain } from '@common/utils/domains'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useDomainsControllerState from '@web/hooks/useDomainsController/useDomainsController'

const useAccounts = () => {
  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const search = watch('search')
  const { domains } = useDomainsControllerState()
  const accountsState = useAccountsControllerState()

  const accounts = useMemo(
    () =>
      accountsState.accounts.filter((account) => {
        if (!search) return true

        const doesAddressMatch = account.addr.toLowerCase().includes(search.toLowerCase())
        const doesDomainMatch = findAccountDomainFromPartialDomain(account.addr, search, domains)
        const doesLabelMatch = account.preferences.label
          .toLowerCase()
          .includes(search.toLowerCase())
        const isSmartAccount = !!account?.creation
        const doesSmartAccountMatch =
          isSmartAccount && 'smart account'.includes(search.toLowerCase())
        const doesBasicAccountMatch =
          !isSmartAccount && 'basic account'.includes(search.toLowerCase())

        return (
          doesAddressMatch ||
          doesLabelMatch ||
          doesSmartAccountMatch ||
          doesBasicAccountMatch ||
          doesDomainMatch
        )
      }),
    [accountsState.accounts, domains, search]
  )

  return { accounts, control }
}

export default useAccounts
