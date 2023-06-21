import React, { useEffect, useState, useCallback, useMemo, createContext } from 'react'
import useStorageController from '@common/hooks/useStorageController'

const StepperContext = createContext<any>({
  updateStepperState: () => Promise.resolve(),
  stepperState: { currentStep: 0, currentFlow: 'emailAuth' },
  getCurrentFlowSteps: () => {}
})

const flows = {
  emailAuth: [
    'Create Email\nVault',
    'Email\nConfirmation',
    'Setup Key\nStore',
    'Personalize\nAccounts'
  ],
  hwAuth: [
    'Pick Hardware Device',
    'Pick Accounts To Import',
    'Setup Key\nStore',
    'Personalize\nAccounts'
  ],
  legacyAuth: ['Import Legacy Account', 'Setup Key\nStore', 'Personalize\nAccounts']
}

const StepperProvider = ({ children }: { children: React.ReactNode }) => {
  const { getItem, setItem } = useStorageController()

  const [stepperState, setStepperState] = useState(() => {
    const storedState = getItem('stepperState')
    return storedState
      ? JSON.parse(storedState)
      : {
          currentStep: 0,
          currentFlow: 'emailAuth'
        }
  })

  useEffect(() => {
    setItem('stepperState', JSON.stringify(stepperState))
  }, [stepperState, setItem])

  const updateStepperState = (newStep: number, newFlow: string) => {
    setStepperState((prevState: { newStep: number; newFlow: string }) => ({
      ...prevState,
      ...{ currentStep: newStep, currentFlow: newFlow }
    }))
  }

  const getCurrentFlowSteps = useCallback(() => {
    const currentFlow = stepperState.currentFlow
    return flows[currentFlow] || []
  }, [stepperState])

  const value = useMemo(
    () => ({
      stepperState,
      updateStepperState,
      getCurrentFlowSteps
    }),
    [stepperState, getCurrentFlowSteps]
  )

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
}

export { StepperContext, StepperProvider }
