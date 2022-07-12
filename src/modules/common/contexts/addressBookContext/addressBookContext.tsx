import useAddressBook, { UseAddressBookReturnType } from 'ambire-common/src/hooks/useAddressBook'
import React, { createContext, useMemo } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useStorage from '@modules/common/hooks/useStorage'
import useToasts from '@modules/common/hooks/useToast'

const AddressBookContext = createContext<UseAddressBookReturnType>({
  addresses: [],
  addAddress: () => {},
  removeAddress: () => {},
  isKnownAddress: () => false
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
