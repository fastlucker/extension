import { useContext } from 'react'

import { SettingsControllerStateContext } from '@web/contexts/settingsControllerStateContext'

export default function useSettingsControllerState() {
  const context = useContext(SettingsControllerStateContext)

  if (!context) {
    throw new Error(
      'useSettingsControllerState must be used within a SettingsControllerStateProvider'
    )
  }

  return context
}
