/* eslint-disable no-restricted-syntax */
import { useCallback, useMemo, useState } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import { AUTH_STATUS } from '../../constants/authStatus'
import useAuth from '../useAuth'

export const flows = {
  getStarted: 'getStarted',
  createNewAccount: 'createNewAccount',
  importExistingAccount: 'importExistingAccount',
  importExistingFromPrivateKey: 'importExistingFromPrivateKey',
  importExistingFromLedger: 'importExistingFromLedger',
  importExistingFromTrezor: 'importExistingFromTrezor',
  importExistingFromGrid: 'importExistingFromGrid',
  importExistingFromJSON: 'importExistingFromJSON',
  watchAddress: 'watchAddress'
}

export default function useOnboardingNavigation(flowType: keyof typeof flows) {
  const { path } = useRoute()
  const { hasPasswordSecret } = useKeystoreControllerState()
  const { authStatus } = useAuth()
  const { navigate } = useNavigation()

  const [currentFlowType, setCurrentFlowType] = useState<keyof typeof flows>(flowType)

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

  const goToNextRoute = useCallback(() => {
    if (!flows[flowType]) return

    setCurrentFlowType(flowType)

    const currentRoute = path?.substring(1) as string
    const flow = onboardingFlowBranches[flowType]

    const currentIndex = flow.indexOf(currentRoute)

    if (flow[currentIndex - 1]) {
      navigate(flow[currentIndex - 1])
    }
  }, [navigate, onboardingFlowBranches, path, flowType])

  const goToPrevRoute = useCallback(() => {
    if (!flows[flowType]) return

    setCurrentFlowType(flowType)

    const currentRoute = path?.substring(1) as string
    const flow = onboardingFlowBranches[flowType]

    const currentIndex = flow.indexOf(currentRoute)

    if (flow[currentIndex - 1]) {
      navigate(flow[currentIndex - 1])
    }
  }, [navigate, onboardingFlowBranches, path, flowType])

  return {
    currentFlowType,
    goToNextRoute,
    goToPrevRoute
  }
}
