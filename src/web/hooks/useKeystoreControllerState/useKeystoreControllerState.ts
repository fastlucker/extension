import { useContext } from 'react'

import { KeystoreControllerStateContext } from '@web/contexts/keystoreControllerStateContext'

export default function useKeystoreControllerState() {
  const context = useContext(KeystoreControllerStateContext)

  if (!context) {
    throw new Error(
      'useKeystoreControllerState must be used within a KeystoreControllerStateProvider'
    )
  }

  return context
}
