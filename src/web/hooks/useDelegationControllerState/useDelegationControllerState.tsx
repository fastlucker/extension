import { DelegationControllerStateContext } from '@web/contexts/DelegationControllerStateContext'
import { useContext } from 'react'

export default function useFeatureFlagsControllerState() {
  const context = useContext(DelegationControllerStateContext)

  if (!context) {
    throw new Error(
      'useFeatureFlagsControllerState must be used within a FeatureFlagsControllerStateProvider'
    )
  }

  return context
}
