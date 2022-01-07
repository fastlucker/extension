import { useContext } from 'react'

import { AddressBookContext } from '@modules/common/contexts/addressBookContext'

export default function useAddressBook() {
  const context = useContext(AddressBookContext)

  if (!context) {
    throw new Error('useAddressBook must be used within an AddressBookProvider')
  }

  return context
}
