import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Account as AccountType } from '@ambire-common/interfaces/account'
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
  const [isReadyToScrollToSelectedAccount, setIsReadyToScrollToSelectedAccount] = useState(false)
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

  const selectedAccountIndex = accounts.findIndex(
    (account) => account.addr === accountsState.selectedAccount
  )

  const onContentSizeChange = useCallback((_: any, contentHeight: number) => {
    if (contentHeight > 0) {
      setIsReadyToScrollToSelectedAccount(true)
    }
  }, [])

  const keyExtractor = useCallback((account: AccountType) => account.addr, [])

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 68,
      offset: 68 * index,
      index
    }),
    []
  )

  return {
    accounts,
    selectedAccountIndex,
    control,
    onContentSizeChange,
    keyExtractor,
    getItemLayout,
    isReadyToScrollToSelectedAccount
  }
}

export default useAccounts
