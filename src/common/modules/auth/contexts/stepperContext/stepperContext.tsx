import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useRoute from '@common/hooks/useRoute'
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
  const { path } = useRoute()
  const [paths, setPaths] = useState<string[]>(() => {
    const storedState = getItem('navigationPaths')
    // return storedState ? JSON.parse(storedState) : []
    if (!storedState) return []

    const parsedState = JSON.parse(storedState)

    // In case the user refreshes the page, we need to make sure that the path is in the array
    if (!parsedState.includes(path)) return []

    return parsedState
  })

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
    setItem('navigationPaths', JSON.stringify(paths))
  }, [stepperState, setItem, paths])

  const updateStepperState = (newStep: number, newFlow: string) => {
    setStepperState((prevState: { newStep: number; newFlow: string }) => ({
      ...prevState,
      ...{ currentStep: newStep, currentFlow: newFlow }
    }))
  }

  // This useEffect is used to update the stepperState when the user goes back.
  // Using a paths list ensures that we can detect the user going back, even if
  // they use browser back buttons, shortcuts or refresh the page.
  useEffect(() => {
    if (path && typeof path === 'string') {
      setPaths((prevState: string[]) => {
        if (!prevState.includes(path)) {
          return [...prevState, path]
        }
        setStepperState((prevStepperState: { currentStep: number; currentFlow: string }) => ({
          ...prevStepperState,
          currentStep: prevStepperState.currentStep - 1
        }))
        return prevState.slice(0, -1)
      })
    }
  }, [path])

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
