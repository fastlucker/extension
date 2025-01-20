import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { canBecomeSmarter } from '@ambire-common/libs/account/account'
import AccountOption from '@common/components/Option/AccountOption'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import useAccountsList from '@common/hooks/useAccountsList'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'

import { SettingsRoutesContext } from '../../contexts/SettingsRoutesContext'

const SmarterEOAsSettings = () => {
  const { accounts } = useAccountsList()
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)
  const { account: accountData } = useSelectedAccountControllerState()
  const { keys } = useKeystoreControllerState()
  const { maxWidthSize } = useWindowSize()

  useEffect(() => {
    setCurrentSettingsPage('basic-to-smart')
  }, [setCurrentSettingsPage])

  const getAccKeys = useCallback(
    (acc: Account | undefined) => {
      return keys.filter((key) => acc?.associatedKeys.includes(key.addr))
    },
    [keys]
  )

  const canSelectedAccountBeTransformedToSmart = useMemo(() => {
    if (!accountData) return false

    return canBecomeSmarter(accountData, getAccKeys(accountData))
  }, [accountData, getAccKeys])

  const [account, setAccount] = useState<Account | undefined>(
    canSelectedAccountBeTransformedToSmart
      ? (accountData as Account)
      : accounts.find((acc) => canBecomeSmarter(acc, getAccKeys(acc)))
  )

  const accountsOptions: SelectValue[] = useMemo(() => {
    return accounts
      .filter((acc) => canBecomeSmarter(acc, getAccKeys(acc)))
      .map((acc) => ({
        value: acc.addr,
        label: <AccountOption acc={acc} />,
        extraSearchProps: { accountLabel: acc.preferences.label }
      }))
  }, [accounts, getAccKeys])

  const handleSetAccountValue = useCallback(
    (accountOption: SelectValue) => {
      setAccount(accounts.filter((acc) => acc.addr === accountOption.value)[0])
    },
    [accounts]
  )

  return (
    <>
      <SettingsPageHeader title="Basic to Smart" />
      {accountsOptions && account ? (
        <View style={[flexbox.directionRow, spacings.mbLg]}>
          <Select
            setValue={handleSetAccountValue}
            containerStyle={{ width: maxWidthSize('xl') ? 420 : 340, ...spacings.mr }}
            options={accountsOptions}
            value={accountsOptions.filter((opt) => opt.value === account.addr)[0]}
          />
        </View>
      ) : (
        'Noo options'
      )}
    </>
  )
}

export default React.memo(SmarterEOAsSettings)
