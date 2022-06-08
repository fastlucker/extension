import useAddressBook from 'ambire-common/src/hooks/useAddressBook'
import React, { createContext, useMemo } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useStorage from '@modules/common/hooks/useStorage'
import useToasts from '@modules/common/hooks/useToast'

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

const AddressBookProvider: React.FC = ({ children }) => {
  const { addresses, addAddress, removeAddress, isKnownAddress } = useAddressBook({
    useAccounts,
    useStorage,
    useToasts
  })

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
