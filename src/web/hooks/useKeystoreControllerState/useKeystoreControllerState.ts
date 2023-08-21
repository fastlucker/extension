import { useContext, useEffect } from 'react'

import { KeystoreControllerStateContext } from '@web/contexts/keystoreControllerStateContext'
import useBackgroundService from '@web/hooks/useBackgroundService'

export default function useKeystoreControllerState() {
  const { dispatch } = useBackgroundService()
  const context = useContext(KeystoreControllerStateContext)

  useEffect(() => {
    dispatch({ type: 'KEYSTORE_CONTROLLER_RESET_ERROR_STATE' })
  }, [dispatch])

  if (!context) {
    throw new Error(
      'useKeystoreControllerState must be used within a KeystoreControllerStateProvider'
    )
  }

  return context
}
