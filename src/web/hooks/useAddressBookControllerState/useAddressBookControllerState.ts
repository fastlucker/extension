import { useContext } from 'react'

import { AddressBookControllerStateContext } from '@web/contexts/addressBookControllerStateContext'

export default function useAddressBookControllerState() {
  const context = useContext(AddressBookControllerStateContext)

  if (!context) {
    throw new Error(
      'useAddressBookControllerState must be used within a AddressBookControllerStateProviders'
    )
  }

  return context
}
