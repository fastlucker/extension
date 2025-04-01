/* eslint-disable no-restricted-syntax */
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

const OnboardingNavigationContext = createContext<{
  currentFlowType: keyof typeof flows | null
  goToNextRoute: (flowKey?: keyof typeof flows, stateParams?: any) => void
  goToPrevRoute: (flowKey?: keyof typeof flows, stateParams?: any) => void
}>({
  currentFlowType: null,
  goToNextRoute: () => {},
  goToPrevRoute: () => {}
})

const onboardingRoutes = [
  WEB_ROUTES.getStarted,
  WEB_ROUTES.createSeedPhrasePrepare,
  WEB_ROUTES.createSeedPhraseWrite,
  WEB_ROUTES.importExistingAccount,
  WEB_ROUTES.importPrivateKey,
  WEB_ROUTES.importSeedPhrase,
  WEB_ROUTES.importSmartAccountJson,
  WEB_ROUTES.viewOnlyAccountAdder,
  WEB_ROUTES.keyStoreSetup,
  WEB_ROUTES.accountPersonalize,
  WEB_ROUTES.accountAdder
]

// These routes are accessible only through internal navigation, preventing direct access via the URL bar.
const protectedOnboardingRoutes = [
  WEB_ROUTES.createSeedPhraseWrite,
  WEB_ROUTES.importPrivateKey,
  WEB_ROUTES.importSeedPhrase,
  WEB_ROUTES.importSmartAccountJson,
  WEB_ROUTES.viewOnlyAccountAdder,
  WEB_ROUTES.keyStoreSetup,
  WEB_ROUTES.accountPersonalize,
  WEB_ROUTES.accountAdder
]

const flows = {
  getStarted: WEB_ROUTES.getStarted,
  createNewAccount: 'createNewAccount',
  importExistingAccount: WEB_ROUTES.importExistingAccount,
  importExistingFromPrivateKey: 'importExistingFromPrivateKey',
  importExistingFromSeedPhrase: 'importExistingFromSeedPhrase',
  importExistingFromLedger: 'importExistingFromLedger',
  importExistingFromTrezor: 'importExistingFromTrezor',
  importExistingFromGrid: 'importExistingFromGrid',
  importExistingFromJSON: 'importExistingFromJSON',
  watchAddress: 'watchAddress'
}

const OnboardingNavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const { path, params } = useRoute()
  const { hasPasswordSecret } = useKeystoreControllerState()
  const { authStatus } = useAuth()
  const { navigate } = useNavigation()

  // Retrieve from sessionStorage or default to 'getStarted'
  const [currentFlowType, setCurrentFlowType] = useState<keyof typeof flows>(() => {
    return (sessionStorage.getItem('currentFlowType') as keyof typeof flows) || 'getStarted'
  })

  useEffect(() => {
    sessionStorage.setItem('currentFlowType', currentFlowType)
  }, [currentFlowType])

  const onboardingFlowBranches = useMemo(() => {
    const currentRoute = path?.substring(1)

    const common = [WEB_ROUTES.accountPersonalize, '/']
    if (currentRoute === WEB_ROUTES.accountAdder) common.splice(1, 0, WEB_ROUTES.accountAdder)

    const dynamic = []

    if (!hasPasswordSecret || currentRoute === WEB_ROUTES.keyStoreSetup) {
      dynamic.push(WEB_ROUTES.keyStoreSetup)
    }

    const initial =
      authStatus === AUTH_STATUS.NOT_AUTHENTICATED ? [WEB_ROUTES.getStarted] : ['get-started']
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
      [flows.importExistingFromSeedPhrase]: [
        ...initial,
        WEB_ROUTES.importExistingAccount,
        WEB_ROUTES.importSeedPhrase,
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

  const goToNextRoute = useCallback(
    (flowKey?: keyof typeof flows, stateParams?: any) => {
      const flowType = flowKey && flows[flowKey] ? flowKey : currentFlowType
      const currentRoute = path?.substring(1) as string
      const flow = onboardingFlowBranches[flows[flowType]]
      const currentIndex = flow.indexOf(currentRoute)

      let nextRoute = flow[currentIndex + 1] || flow[0]

      if (nextRoute === currentRoute) nextRoute = '/'

      if (nextRoute) {
        navigate(nextRoute, { state: { internal: true, ...stateParams } })
        !!flowKey && !!flows[flowKey] && setCurrentFlowType(flowKey)
      }
    },
    [navigate, onboardingFlowBranches, path, currentFlowType]
  )

  const goToPrevRoute = useCallback(
    (flowKey?: keyof typeof flows, stateParams?: any) => {
      const flowType = flowKey && flows[flowKey] ? flowKey : currentFlowType
      const currentRoute = path?.substring(1) as string
      const flow = onboardingFlowBranches[flows[flowType]]
      const currentIndex = flow.indexOf(currentRoute)
      let nextRoute = flow[currentIndex - 1] || flow[0]

      if (nextRoute === currentRoute) nextRoute = '/'

      if (nextRoute) {
        navigate(nextRoute, { state: { internal: true, ...stateParams } })
        !!flowKey && !!flows[flowKey] && setCurrentFlowType(flowKey)
      }
    },
    [navigate, onboardingFlowBranches, path, currentFlowType]
  )

  useEffect(() => {
    const currentRoute = path?.substring(1) as string
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const flowKey = Object.entries(flows).find(([key, value]) => value === currentRoute)?.[0]
    if (flowKey && flowKey !== currentFlowType) {
      setCurrentFlowType(flowKey as keyof typeof flows)
    }
  }, [currentFlowType, path])

  useEffect(() => {
    const currentRoute = path?.substring(1) as string

    if (!currentRoute) return

    if (!protectedOnboardingRoutes.includes(currentRoute)) return

    if (!params?.internal) navigate('/', { state: { internal: true } })
  }, [path, params, navigate])

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
