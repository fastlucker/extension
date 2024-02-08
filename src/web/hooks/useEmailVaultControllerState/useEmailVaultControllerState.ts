import { useContext } from 'react'

import { EmailVaultControllerStateContext } from '@web/contexts/emailVaultControllerStateContext'

export default function useEmailVaultControllerState() {
  const context = useContext(EmailVaultControllerStateContext)

  if (!context) {
    throw new Error(
      'useEmailVaultControllerState must be used within an EmailVaultControllerStateProvider'
    )
  }

  return context
}
