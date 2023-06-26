import { useContext } from 'react'

import { StepperContext } from '@common/modules/auth/contexts/stepperContext'

export default function useStepper() {
  const context = useContext(StepperContext)

  if (!context) {
    throw new Error('useStepper must be used within an StepperProvider')
  }

  return context
}
