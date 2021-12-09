import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

const AccountsContext = createContext<any>({ token: null, logIn: () => {} })

const AccountsProvider: React.FC = ({ children }) => {
  const [accounts, setAccounts] = useState<any>([])
  const [selectedAcc, setSelectedAcc] = useState<any>('')

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
        // TODO: set this as a app notification
        console.log(
          JSON.stringify(existing) === JSON.stringify(acc)
            ? 'Account already added'
            : 'Account updated'
        )
      } else if (opts.isNew) {
        // TODO: set this as a app notification
        console.log(
          `New Ambire account created: ${acc.id}${
            acc.signer.address ? '. This is a fresh smart wallet address.' : ''
          }`,
          { timeout: acc.signer.address ? 15000 : 10000 }
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
        // TODO: add some logic here if needed
      }
    },
    [accounts, onSelectAcc]
  )

  const onRemoveAccount = useCallback(
    (id) => {
      if (!id) throw new Error('account: internal err: missing ID/Address')

      const clearedAccounts = accounts.filter((account: any) => account.id !== id)
      setAccounts([...clearedAccounts])
      AsyncStorage.setItem('accounts', JSON.stringify(clearedAccounts))

      if (!clearedAccounts.length) {
        // TODO: add some logic here if needed
      } else onSelectAcc(clearedAccounts[0].id)
    },
    [accounts, onSelectAcc]
  )

  return (
    <AccountsContext.Provider
      value={useMemo(
        () => ({ accounts, selectedAcc, onSelectAcc, onAddAccount, onRemoveAccount }),
        [accounts, selectedAcc, onSelectAcc, onAddAccount, onRemoveAccount]
      )}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export { AccountsContext, AccountsProvider }
