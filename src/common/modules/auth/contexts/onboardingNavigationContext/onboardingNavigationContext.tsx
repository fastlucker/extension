/* eslint-disable no-restricted-syntax */
import React, { createContext, useCallback, useMemo, useState } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import { AUTH_STATUS } from '../../constants/authStatus'
import useAuth from '../../hooks/useAuth'

const OnboardingNavigationContext = createContext<{
  currentFlowType: keyof typeof flows | null
  goToNextRoute: (flowType: keyof typeof flows) => void
  goToPrevRoute: (flowType: keyof typeof flows) => void
}>({
  currentFlowType: null,
  goToNextRoute: () => {},
  goToPrevRoute: () => {}
})

const flows = {
  getStarted: WEB_ROUTES.getStarted,
  createNewAccount: 'createNewAccount',
  importExistingAccount: [WEB_ROUTES.importExistingAccount],
  importExistingFromPrivateKey: 'importExistingFromPrivateKey',
  importExistingFromLedger: 'importExistingFromLedger',
  importExistingFromTrezor: 'importExistingFromTrezor',
  importExistingFromGrid: 'importExistingFromGrid',
  importExistingFromJSON: 'importExistingFromJSON',
  watchAddress: 'watchAddress'
}

const OnboardingNavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const { path } = useRoute()
  const { hasPasswordSecret } = useKeystoreControllerState()
  const { authStatus } = useAuth()
  const { navigate } = useNavigation()

  const [currentFlowType, setCurrentFlowType] = useState<keyof typeof flows>('getStarted')

  const onboardingFlowBranches = useMemo(() => {
    const currentRoute = path?.substring(1)

    const common = [WEB_ROUTES.accountPersonalize, WEB_ROUTES.accountAdder]
    if (currentRoute === WEB_ROUTES.accountAdder) common.splice(1, 0, WEB_ROUTES.accountAdder)

    const dynamic = []

    if (!hasPasswordSecret) {
      dynamic.push(WEB_ROUTES.keyStoreSetup)
    }

    const initial = authStatus === AUTH_STATUS.NOT_AUTHENTICATED ? [WEB_ROUTES.getStarted] : []
    const branches = {
      [flows.getStarted]: [...initial],
      [flows.createNewAccount]: [
        ...initial,
        WEB_ROUTES.createSeedPhrasePrepare,
        WEB_ROUTES.createSeedPhraseWrite,
        ...dynamic,
        ...common
      ],
      [WEB_ROUTES.importExistingAccount]: [...initial, WEB_ROUTES.importExistingAccount],
      [flows.importExistingFromPrivateKey]: [
        ...initial,
        WEB_ROUTES.importExistingAccount,
        WEB_ROUTES.importPrivateKey,
        ...dynamic,
        ...common
      ],
      [flows.importExistingFromLedger]: [
        ...initial,
        WEB_ROUTES.importExistingAccount,
        'ledger', // TODO:
        ...dynamic,
        ...common
      ],
      [flows.importExistingFromTrezor]: [
        ...initial,
        WEB_ROUTES.importExistingAccount,
        'trezor', // TODO:
        ...dynamic,
        ...common
      ],
      [flows.importExistingFromGrid]: [
        ...initial,
        WEB_ROUTES.importExistingAccount,
        'grid', // TODO:
        ...dynamic,
        ...common
      ],
      [flows.importExistingFromJSON]: [
        ...initial,
        WEB_ROUTES.importExistingAccount,
        WEB_ROUTES.importSmartAccountJson,
        ...dynamic,
        ...common
      ],
      [flows.watchAddress]: [...initial, WEB_ROUTES.viewOnlyAccountAdder, ...dynamic, ...common]
    }

    return branches
  }, [hasPasswordSecret, path, authStatus])

  const updateFlowIfNeeded = (nextRoute: string, flow?: keyof typeof flows) => {
    if (!nextRoute) return

    const nextFlow = Object.keys(flows).find((flowKey) => flowKey === nextRoute) as
      | keyof typeof flows
      | undefined

    if (nextFlow) setCurrentFlowType(nextFlow)
  }

  const goToNextRoute = useCallback(
    (flowType?: keyof typeof flows) => {
      setCurrentFlowType(flowType)

      const currentRoute = path?.substring(1) as string
      const flow = onboardingFlowBranches[flowType]
      const currentIndex = flow.indexOf(currentRoute)
      const nextRoute = flow[currentIndex + 1]

      if (nextRoute) {
        navigate(nextRoute)
        updateFlowIfNeeded(nextRoute)
      }
    },
    [navigate, onboardingFlowBranches, path]
  )

  const goToPrevRoute = useCallback(
    (flowType: keyof typeof flows) => {
      if (!flows[flowType]) return

      setCurrentFlowType(flowType)

      const currentRoute = path?.substring(1) as string
      const flow = onboardingFlowBranches[flowType]

      const currentIndex = flow.indexOf(currentRoute)

      const nextRoute = flow[currentIndex - 1]
      if (nextRoute) {
        navigate(nextRoute)
        updateFlowIfNeeded(nextRoute)
      }
    },
    [navigate, onboardingFlowBranches, path]
  )

  const value = useMemo(
    () => ({ currentFlowType, goToNextRoute, goToPrevRoute }),
    [currentFlowType, goToPrevRoute, goToNextRoute]
  )

  return (
    <OnboardingNavigationContext.Provider value={value}>
      {children}
    </OnboardingNavigationContext.Provider>
  )
}

export { OnboardingNavigationContext, OnboardingNavigationProvider }
