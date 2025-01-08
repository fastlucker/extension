import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FlatList } from 'react-native'

import { Account as AccountType } from '@ambire-common/interfaces/account'
import { findAccountDomainFromPartialDomain } from '@common/utils/domains'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useDomainsControllerState from '@web/hooks/useDomainsController/useDomainsController'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

const useAccountsList = ({
  flatlistRef
}: {
  flatlistRef?: React.RefObject<FlatList<AccountType>> | null
} = {}) => {
  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const search = watch('search')
  const [areAccountsRendered, setAreAccountsRendered] = useState(false)
  const [isReadyToScrollToSelectedAccount, setIsReadyToScrollToSelectedAccount] = useState(false)
  const { domains } = useDomainsControllerState()
  const { accounts } = useAccountsControllerState()
  const { account: selectedAccount } = useSelectedAccountControllerState()

  const filteredAccounts = useMemo(
    () =>
      accounts.filter((account) => {
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
    [accounts, domains, search]
  )

  const selectedAccountIndex = accounts.findIndex(
    (account) => account.addr === selectedAccount?.addr
  )

  const onContentSizeChange = useCallback(
    (_: any, contentHeight: number) => {
      if (contentHeight > 0 && !areAccountsRendered) {
        setAreAccountsRendered(true)
      }
    },
    [areAccountsRendered]
  )

  const keyExtractor = useCallback((account: AccountType) => account.addr, [])

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 64,
      offset: 64 * index,
      index
    }),
    []
  )

  useEffect(() => {
    if (
      areAccountsRendered &&
      selectedAccountIndex !== -1 &&
      flatlistRef?.current &&
      !isReadyToScrollToSelectedAccount
    ) {
      flatlistRef.current.scrollToIndex({
        animated: false,
        index: selectedAccountIndex
      })
      setIsReadyToScrollToSelectedAccount(true)
    }
  }, [areAccountsRendered, flatlistRef, isReadyToScrollToSelectedAccount, selectedAccountIndex])

  return {
    accounts: filteredAccounts,
    selectedAccountIndex,
    control,
    search,
    onContentSizeChange,
    keyExtractor,
    getItemLayout,
    isReadyToScrollToSelectedAccount
  }
}

export default useAccountsList
