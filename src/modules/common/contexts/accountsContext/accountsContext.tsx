import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import i18n from '@config/localization/localization'
import useAuth from '@modules/auth/hooks/useAuth'
import useToast from '@modules/common/hooks/useToast'
import { navigate } from '@modules/common/services/navigation'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AccountsContextData = {
  account: any
  accounts: any[]
  selectedAcc: any
  onSelectAcc: (selected: any) => void
  onAddAccount: (acc: any, opts: any) => void
  onRemoveAccount: (id: string) => void
}

const AccountsContext = createContext<AccountsContextData>({
  accounts: [],
  account: {},
  selectedAcc: '',
  onSelectAcc: () => {},
  onAddAccount: () => false,
  onRemoveAccount: () => {}
})

const AccountsProvider: React.FC = ({ children }) => {
  const [accounts, setAccounts] = useState<any[]>([])
  const [selectedAcc, setSelectedAcc] = useState<string | null>('')
  const { setIsAuthenticated, isAuthenticated } = useAuth()
  const { addToast } = useToast()

  const initState = async () => {
    try {
      const accs = (await AsyncStorage.getItem('accounts')) || '[]'
      const parsedAccs = JSON.parse(accs)
      if (!Array.isArray(parsedAccs)) throw new Error('accounts: incorrect format')
      setAccounts(parsedAccs)

      const initialSelectedAcc = await AsyncStorage.getItem('selectedAcc')
      if (!initialSelectedAcc || !parsedAccs.find((x: any) => x.id === initialSelectedAcc)) {
        setSelectedAcc(accounts[0] ? accounts[0].id : '')
      }
      setSelectedAcc(initialSelectedAcc)
    } catch (e) {
      console.error('accounts parsing failure', e)
      setAccounts([])
    }
  }

  useEffect(() => {
    initState()
  }, [])

  const onSelectAcc = useCallback(
    (selected) => {
      AsyncStorage.setItem('selectedAcc', selected)
      setSelectedAcc(selected)
    },
    [setSelectedAcc]
  )

  const onAddAccount = useCallback(
    (acc, opts = {}) => {
      if (!(acc.id && acc.signer)) throw new Error('account: internal err: missing ID or signer')

      const existing = accounts.find((x: any) => x.id.toLowerCase() === acc.id.toLowerCase())
      if (existing) {
        addToast(
          JSON.stringify(existing) === JSON.stringify(acc)
            ? (i18n.t('Account already added') as string)
            : (i18n.t('Account updated') as string)
        )
      }
      if (opts.isNew) {
        // TODO: consider something more explanatory such as "using Trezor as a signer", or "this is different from your signer address"
        acc.signer.address
          ? addToast(
              i18n.t(
                'New Ambire account created:{{account}}. This is a fresh smart wallet address.',
                { account: acc.id }
              ) as string
            )
          : addToast(
              i18n.t('New Ambire account created:{{account}}', { account: acc.id }) as string
            )
      }

      const existingIdx = accounts.indexOf(existing)
      if (existingIdx === -1) accounts.push(acc)
      else accounts[existingIdx] = acc

      // need to make a copy, otherwise no rerender
      setAccounts([...accounts])
      AsyncStorage.setItem('accounts', JSON.stringify(accounts))

      if (opts.select) onSelectAcc(acc.id)
      if (Object.keys(accounts).length) {
        if (isAuthenticated) {
          navigate('dashboard')
        } else {
          setIsAuthenticated(true)
        }
      }
    },
    [accounts, onSelectAcc, isAuthenticated]
  )

  const onRemoveAccount = useCallback(
    (id) => {
      if (!id) throw new Error('account: internal err: missing ID/Address')

      try {
        const clearedAccounts = accounts.filter((account: any) => account.id !== id)
        setAccounts([...clearedAccounts])
        AsyncStorage.setItem('accounts', JSON.stringify(clearedAccounts))

        if (!clearedAccounts.length) {
          AsyncStorage.removeItem('selectedAcc')
          setSelectedAcc('')
          setIsAuthenticated(false)
        } else onSelectAcc(clearedAccounts[0].id)
      } catch (error) {
        // Silent error
      }
    },
    [accounts, onSelectAcc]
  )

  return (
    <AccountsContext.Provider
      value={useMemo(
        () => ({
          accounts,
          selectedAcc,
          onSelectAcc,
          onAddAccount,
          onRemoveAccount,
          account: accounts.find((x) => x.id === selectedAcc)
        }),
        [accounts, selectedAcc, onSelectAcc, onAddAccount, onRemoveAccount]
      )}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export { AccountsContext, AccountsProvider }
