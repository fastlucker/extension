import { isKnownTokenOrContract, isValidAddress } from 'ambire-common/src/services/address'
import { setKnownAddresses } from 'ambire-common/src/services/humanReadableTransactions'
import { sha256 } from 'ethers/lib/utils'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import i18n from '@config/localization/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useStorage from '@modules/common/hooks/useStorage'
import useToast from '@modules/common/hooks/useToast'

type AddressBookContextData = {
  addresses: any
  addAddress: any
  removeAddress: (name: string, address: string, isUD: boolean) => void
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

const AddressBookProvider: React.FC = ({ children }) => {
  const { accounts } = useAccounts()
  const { addToast } = useToast()

  const [storageAddresses, setStorageAddresses] = useStorage({ key: 'addresses', defaultValue: [] })

  const addressList = useMemo(() => {
    try {
      const addresses = storageAddresses
      if (!Array.isArray(addresses)) throw new Error('Address Book: incorrect format')
      return [
        ...accounts.map((account) => ({
          isAccount: true,
          name: accountType(account),
          address: account.id
        })),
        ...addresses.map((entry) => ({
          ...entry
        }))
      ]
    } catch (e) {
      console.error('Address Book parsing failure', e)
      return []
    }
  }, [accounts, storageAddresses])

  const [addresses, setAddresses] = useState(() => addressList)

  const updateAddresses = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (addresses: any) => {
      setAddresses(
        addresses.map((entry: any) => ({
          ...entry
        }))
      )
      setStorageAddresses(addresses.filter(({ isAccount }: any) => !isAccount))
    },
    [setAddresses, setStorageAddresses]
  )

  const isKnownAddress = useCallback(
    (address) => {
      return [
        // eslint-disable-next-line @typescript-eslint/no-shadow
        ...addresses.map(({ address }) => {
          return address.startsWith('0x') && address.indexOf('.') === -1 ? sha256(address) : address
        }),
        ...accounts.map(({ id }) => sha256(id))
      ].includes(
        address.startsWith('0x') && address.indexOf('.') === -1 ? sha256(address) : address
      )
    },
    [addresses, accounts]
  )

  const addAddress = useCallback(
    (name, address, isUD = false) => {
      if (!name || !address) throw new Error('Address Book: invalid arguments supplied')

      if (isUD) {
        const isFound = addresses.find(
          (item) => item.address.toLowerCase() === address.toLowerCase()
        )
        if (isFound)
          return addToast('Address Book: The UD is already added to the Address book', {
            error: true
          })
      } else {
        const isFound = addresses.find(
          (item) => item.address.toLowerCase() === address.toLowerCase()
        )
        if (isFound)
          return addToast('Address Book: The address is already added to the Address book', {
            error: true
          })
        if (!isValidAddress(address)) throw new Error('Address Book: invalid address format')
        if (isKnownTokenOrContract(address))
          return addToast("The address you're trying to add is a smart contract.", { error: true })
      }

      const newAddresses = [
        ...addresses,
        {
          name,
          address,
          isUD
        }
      ]

      updateAddresses(newAddresses)

      addToast(i18n.t('{{address}} added to your Address Book.', { address }) as string)
    },
    [addresses, addToast, updateAddresses]
  )

  const removeAddress = useCallback(
    (name, address, isUD) => {
      if (!name || !address) throw new Error('Address Book: invalid arguments supplied')

      if (!isUD) {
        if (!isValidAddress(address)) throw new Error('Address Book: invalid address format')
      }

      const newAddresses = addresses.filter((a) => !(a.name === name && a.address === address))

      updateAddresses(newAddresses)

      addToast(i18n.t('{{address}} removed from your Address Book.', { address }) as string)
    },
    [addresses, addToast, updateAddresses]
  )

  useEffect(() => {
    setAddresses(addressList)
  }, [accounts, addressList])

  // a bit of a 'cheat': update the humanizer with the latest known addresses
  // this is breaking the react patterns cause the humanizer has a 'global' state, but that's fine since it simply constantly learns new addr aliases,
  // so there's no 'inconsistent state' there, the more the better
  useEffect(() => setKnownAddresses(addresses), [addresses])

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
