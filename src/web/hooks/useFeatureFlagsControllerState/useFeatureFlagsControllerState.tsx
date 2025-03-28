import { useContext } from 'react'

import { FeatureFlagsControllerStateContext } from '@web/contexts/featureFlagsControllerStateContext'

export default function useFeatureFlagsControllerState() {
  const context = useContext(FeatureFlagsControllerStateContext)

  if (!context) {
    throw new Error(
      'useFeatureFlagsControllerState must be used within a FeatureFlagsControllerStateProvider'
    )
  }

  return context
}
