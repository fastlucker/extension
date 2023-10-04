import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useRoute from '@common/hooks/useRoute'
import { WEB_ROUTES } from '@common/modules/router/constants/common'

export const STEPPER_FLOWS = {
  email: {
    [WEB_ROUTES.keyStoreSetup]: 'Setup Key\nStore',
    [WEB_ROUTES.createEmailVault]: 'Create Email\nVault',
    'email-confirmation': 'Email\nConfirmation',
    [WEB_ROUTES.accountPersonalize]: 'Personalize\nAccounts'
  },
  hw: {
    [WEB_ROUTES.hardwareWalletSelect]: 'Choose Hardware Wallet',
    'connect-hardware-wallet': 'Login with Hardware Wallet',
    [WEB_ROUTES.accountAdder]: 'Pick Accounts To Import',
    [WEB_ROUTES.accountPersonalize]: 'Personalize\nAccounts'
  },
  legacy: {
    [WEB_ROUTES.keyStoreSetup]: 'Setup Key\nStore',
    [WEB_ROUTES.externalSigner]: 'Import Legacy Account',
    [WEB_ROUTES.accountAdder]: 'Pick Accounts To Import',
    [WEB_ROUTES.accountPersonalize]: 'Personalize\nAccounts'
  }
}

/*
  Adding a route here makes the stepper show in that route. This is an edge case, because
  this route is the step 'connect-hardware-wallet' of the flow 'hw', but is not the only trigger,
  because the other HW wallet are not routes and instead open in a popup.
*/
const EXTRA_STEP_SCREENS = [WEB_ROUTES.hardwareWalletLedger]

const ALL_STEPS_SCREENS = Object.keys(STEPPER_FLOWS)
  .map((key) => {
    // @ts-ignore
    return Object.keys(STEPPER_FLOWS[key]).map((key1) => {
      return key1
    })
  })
  .concat(EXTRA_STEP_SCREENS)
  .flat()

const StepperContext = createContext<{
  updateStepperState: (newStep: string, newFlow: keyof typeof STEPPER_FLOWS) => void
  stepperState: { currentStep: number; currentFlow: keyof typeof STEPPER_FLOWS } | null
  getCurrentFlowSteps: () => string[]
}>({
  updateStepperState: () => Promise.resolve(),
  stepperState: null,
  getCurrentFlowSteps: () => []
})

const StepperProvider = ({ children }: { children: React.ReactNode }) => {
  const { path } = useRoute()

  const [stepperState, setStepperState] = useState<{
    currentStep: number
    currentFlow: keyof typeof STEPPER_FLOWS
  } | null>(null)

  useEffect(() => {
    if (!path) return

    const pathWithoutSlash = path.slice(1)

    // Delete the stepper state if the user navigates to a screen that doesn't have a stepper
    if (ALL_STEPS_SCREENS.includes(pathWithoutSlash)) return

    setStepperState(null)
  }, [path])

  const updateStepperState = useCallback((newStep: string, newFlow: keyof typeof STEPPER_FLOWS) => {
    const newStepIndex = Object.keys(STEPPER_FLOWS[newFlow]).indexOf(newStep)
    if (newStepIndex === -1) {
      console.error(`Step ${newStep} does not exist in flow ${newFlow}`)
      return
    }

    setStepperState({ currentStep: newStepIndex, currentFlow: newFlow })
  }, [])

  const getCurrentFlowSteps = useCallback(() => {
    if (!stepperState) return []

    const currentFlow = stepperState.currentFlow

    return Object.keys(STEPPER_FLOWS[currentFlow]).map((key) => {
      return STEPPER_FLOWS[currentFlow][key]
    })
  }, [stepperState])

  const value = useMemo(
    () => ({
      stepperState,
      updateStepperState,
      getCurrentFlowSteps
    }),
    [stepperState, updateStepperState, getCurrentFlowSteps]
  )

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
}

export { StepperContext, StepperProvider }
