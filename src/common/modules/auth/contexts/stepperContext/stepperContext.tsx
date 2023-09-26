import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useRoute from '@common/hooks/useRoute'
import useStorageController from '@common/hooks/useStorageController'
import { WEB_ROUTES } from '@common/modules/router/constants/common'

const STEPPER_FLOWS = {
  email: {
    [WEB_ROUTES.keyStoreSetup]: 'Setup Key\nStore',
    [WEB_ROUTES.createEmailVault]: 'Create Email\nVault',
    'email-confirmation': 'Email\nConfirmation',
    [WEB_ROUTES.accountPersonalize]: 'Personalize\nAccounts'
  },
  hw: {
    [WEB_ROUTES.hardwareWalletSelect]: 'Pick Hardware Wallet',
    'connect-hardware-wallet': 'Connect Hardware Wallet',
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

// Edge cases like connecting HW wallets, because one step can be many routes.
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
  const { getItem, setItem } = useStorageController()

  const [stepperState, setStepperState] = useState<{
    currentStep: number
    currentFlow: keyof typeof STEPPER_FLOWS
  } | null>(() => {
    const storedState = getItem('stepperState')

    if (!storedState) return null

    return JSON.parse(storedState)
  })

  useEffect(() => {
    if (!path) return

    const pathWithoutSlash = path.slice(1)

    if (ALL_STEPS_SCREENS.includes(pathWithoutSlash)) return

    setStepperState(null)
  }, [path])

  useEffect(() => {
    setItem('stepperState', JSON.stringify(stepperState))
  }, [stepperState, setItem])

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
