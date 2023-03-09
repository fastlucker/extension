import useAddressBook, { UseAddressBookReturnType } from 'ambire-common/src/hooks/useAddressBook'
import React, { createContext, useMemo } from 'react'

import useAccounts from '@common/hooks/useAccounts'
import useConstants from '@common/hooks/useConstants'
import useStorage from '@common/hooks/useStorage'
import useToasts from '@common/hooks/useToast'

const AddressBookContext = createContext<UseAddressBookReturnType>({
  addresses: [],
  addAddress: () => {},
  removeAddress: () => {},
  isKnownAddress: () => false
})

const AddressBookProvider: React.FC = ({ children }) => {
  const { addresses, addAddress, removeAddress, isKnownAddress } = useAddressBook({
    useConstants,
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
