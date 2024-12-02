import { useContext } from 'react'

import { UpdateAvailableControllerStateContext } from '@web/contexts/updateAvailableControllerStateContext'

export default function useUpdateAvailableControllerState() {
  const context = useContext(UpdateAvailableControllerStateContext)

  if (!context) {
    throw new Error(
      'useUpdateAvailableControllerState must be used within UpdateAvailableControllerStateProvider'
    )
  }

  return context
}
