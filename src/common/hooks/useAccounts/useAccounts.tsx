import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import useAccountsControllerState from '@web/hooks/useAccountsControllerState'

const useAccounts = () => {
  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const search = watch('search')

  const accountsState = useAccountsControllerState()

  const accounts = useMemo(
    () =>
      accountsState.accounts.filter((account) => {
        if (!search) return true

        const doesAddressMatch = account.addr.toLowerCase().includes(search.toLowerCase())
        const doesLabelMatch = account.preferences.label
          .toLowerCase()
          .includes(search.toLowerCase())
        const isSmartAccount = !!account?.creation
        const doesSmartAccountMatch =
          isSmartAccount && 'smart account'.includes(search.toLowerCase())
        const doesBasicAccountMatch =
          !isSmartAccount && 'basic account'.includes(search.toLowerCase())

        return doesAddressMatch || doesLabelMatch || doesSmartAccountMatch || doesBasicAccountMatch
      }),
    [accountsState.accounts, search]
  )

  return { accounts, control }
}

export default useAccounts
