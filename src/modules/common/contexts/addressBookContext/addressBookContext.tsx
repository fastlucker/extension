import * as blockies from 'blockies-ts'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import { isKnownTokenOrContract, isValidAddress } from '@modules/common/services/address'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AddressBookContextData = {
  addresses: any
  addAddress: any
  removeAddress: (name: string, address: string) => void
  isKnownAddress: (address: string) => any
}

const AddressBookContext = createContext<AddressBookContextData>({
  addresses: [],
  addAddress: () => {},
  removeAddress: () => {},
  isKnownAddress: () => {}
})

const accountType = ({ email, signerExtra }: any) => {
  const walletType =
    // eslint-disable-next-line no-nested-ternary
    signerExtra && signerExtra.type === 'ledger'
      ? 'Ledger'
      : signerExtra && signerExtra.type === 'trezor'
      ? 'Trezor'
      : 'Web3'
  return email ? `Ambire account for ${email}` : `Ambire account (${walletType})`
}
// TODO: Fix the document error
// const toIcon = (seed: any) => blockies.create({ seed }).toDataURL()
const toIcon = (seed: any) => ''

const AddressBookProvider: React.FC = ({ children }) => {
  const { accounts } = useAccounts()

  const [addresses, setAddresses] = useState<any>([])

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const updateAddresses = (addresses: any) => {
    setAddresses(
      addresses.map((entry: any) => ({
        ...entry,
        icon: toIcon(entry.address)
      }))
    )
    AsyncStorage.setItem(
      'addresses',
      JSON.stringify(addresses.filter(({ isAccount }: any) => !isAccount))
    )
  }

  const isKnownAddress = useCallback(
    (address) =>
      // eslint-disable-next-line @typescript-eslint/no-shadow
      [...addresses.map(({ address }: any) => address), ...accounts.map(({ id }) => id)].includes(
        address
      ),
    [addresses, accounts]
  )

  const addAddress = useCallback(
    (name, address) => {
      if (!name || !address) throw new Error('Address Book: invalid arguments supplied')
      if (!isValidAddress(address)) throw new Error('Address Book: invalid address format')
      if (isKnownTokenOrContract(address))
        // TODO: set global message
        // addToast("The address you're trying to add is a smart contract.", { error: true })
        return

      const newAddresses = [
        ...addresses,
        {
          name,
          address
        }
      ]

      updateAddresses(newAddresses)

      // TODO: set global message
      // addToast(`${address} added to your Address Book.`)
    },
    [addresses]
  )

  const removeAddress = useCallback(
    (name, address) => {
      if (!name || !address) throw new Error('Address Book: invalid arguments supplied')
      if (!isValidAddress(address)) throw new Error('Address Book: invalid address format')

      const newAddresses = addresses.filter((a: any) => !(a.name === name && a.address === address))

      updateAddresses(newAddresses)
      // TODO: set global message
      // addToast(`${address} removed from your Address Book.`)
    },
    [addresses]
  )

  useEffect(() => {
    ;(async () => {
      try {
        const storedAddresses = await AsyncStorage.getItem('addresses')
        const parsedAddresses = JSON.parse(storedAddresses || '[]')
        if (!Array.isArray(parsedAddresses)) throw new Error('Address Book: incorrect format')
        setAddresses([
          ...accounts.map((account: any) => ({
            isAccount: true,
            name: accountType(account),
            address: account.id,
            icon: toIcon(account.id)
          })),
          ...parsedAddresses.map((entry) => ({
            ...entry,
            icon: toIcon(entry.address)
          }))
        ])
      } catch (e) {
        console.error('Address Book parsing failure', e)
        setAddresses([])
      }
    })()
  }, [accounts])

  // a bit of a 'cheat': update the humanizer with the latest known addresses
  // this is breaking the react patterns cause the humanizer has a 'global' state, but that's fine since it simply constantly learns new addr aliases,
  // so there's no 'inconsistent state' there, the more the better
  // TODO: add humanizers logic
  // useEffect(() => setKnownAddresses(addresses), [addresses])

  return (
    <AddressBookContext.Provider
      value={useMemo(
        () => ({ addresses, addAddress, removeAddress, isKnownAddress }),
        [addresses, addAddress, removeAddress, isKnownAddress]
      )}
    >
      {children}
    </AddressBookContext.Provider>
  )
}

export { AddressBookContext, AddressBookProvider }
