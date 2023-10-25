import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import useMainControllerState from '@web/hooks/useMainControllerState'

const useAccounts = () => {
  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const search = watch('search')

  const mainCtrl = useMainControllerState()

  const accounts = useMemo(
    () =>
      mainCtrl.accounts.filter((account) => {
        if (!search) return true

        const doesAddressMatch = account.addr.toLowerCase().includes(search.toLowerCase())
        const doesLabelMatch = account.label.toLowerCase().includes(search.toLowerCase())
        const isSmartAccount = !!account?.creation
        const doesSmartAccountMatch =
          isSmartAccount && 'smart account'.includes(search.toLowerCase())
        const doesLegacyAccountMatch =
          !isSmartAccount && 'legacy account'.includes(search.toLowerCase())

        return doesAddressMatch || doesLabelMatch || doesSmartAccountMatch || doesLegacyAccountMatch
      }),
    [mainCtrl.accounts, search]
  )

  return {
    accounts,
    control
  }
}

export default useAccounts
