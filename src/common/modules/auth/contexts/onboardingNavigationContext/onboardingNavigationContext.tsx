/* eslint-disable no-restricted-syntax */
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { NavigateOptions } from 'react-router-dom'

import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useWalletStateController from '@web/hooks/useWalletStateController'

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
  WEB_ROUTES.accountAdder,
  WEB_ROUTES.onboardingCompleted
] as const

export type OnboardingRoute = typeof onboardingRoutes[number]

const OnboardingNavigationContext = createContext<{
  isOnboardingRoute: boolean
  goToNextRoute: (routeName?: OnboardingRoute, routeParams?: NavigateOptions) => void
  goToPrevRoute: () => void
}>({
  isOnboardingRoute: false,
  goToNextRoute: () => {},
  goToPrevRoute: () => {}
})

class RouteNode {
  name: string

  children: RouteNode[] = []

  disabled: boolean = false

  isProtected: boolean = true

  constructor(name: string, children: RouteNode[] = [], disabled = false, isProtected = true) {
    this.name = name
    if (children) this.children = children
    this.disabled = disabled
    this.isProtected = isProtected
  }
}

const OnboardingNavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const { hasPasswordSecret } = useKeystoreControllerState()
  const { path, params } = useRoute()
  const prevPath: string | undefined = usePrevious(path)
  const { navigate } = useNavigation()
  const { authStatus } = useAuth()
  const { isSetupComplete } = useWalletStateController()
  const { isInitialized } = useAccountAdderControllerState()
  const isOnboardingRoute = useMemo(
    () => onboardingRoutes.includes((path || '').substring(1)),
    [path]
  )

  const onboardingRoutesTree = useMemo(() => {
    const common = [
      new RouteNode(
        WEB_ROUTES.keyStoreSetup,
        [
          new RouteNode(
            WEB_ROUTES.accountPersonalize,
            [
              new RouteNode(WEB_ROUTES.onboardingCompleted, [new RouteNode('/')], isSetupComplete),
              new RouteNode('/'),
              new RouteNode(WEB_ROUTES.accountAdder, [], !isInitialized)
            ],
            !isInitialized
          )
        ],
        hasPasswordSecret
      )
    ]

    return new RouteNode(
      WEB_ROUTES.getStarted,
      [
        new RouteNode(
          WEB_ROUTES.createSeedPhrasePrepare,
          [new RouteNode(WEB_ROUTES.createSeedPhraseWrite, common)],
          false,
          false
        ),
        new RouteNode(
          WEB_ROUTES.importExistingAccount,
          [
            new RouteNode(WEB_ROUTES.importPrivateKey, common),
            new RouteNode(WEB_ROUTES.importSeedPhrase, common),
            new RouteNode('ledger', common),
            new RouteNode('trezor', common),
            new RouteNode('grid', common),
            new RouteNode(WEB_ROUTES.importSmartAccountJson, common)
          ],
          false,
          false
        ),
        new RouteNode(WEB_ROUTES.viewOnlyAccountAdder, common, false, false)
      ],
      authStatus !== AUTH_STATUS.NOT_AUTHENTICATED,
      false
    )
  }, [hasPasswordSecret, authStatus, isSetupComplete, isInitialized])

  const loadHistory = () => {
    try {
      const savedHistory = sessionStorage.getItem('onboarding_history')
      if (savedHistory) return JSON.parse(savedHistory)
    } catch (error) {
      console.error('Failed to load navigation state:', error)
    }
    return []
  }

  const [history, setHistory] = useState<string[]>(loadHistory())

  useEffect(() => {
    sessionStorage.setItem('onboarding_history', JSON.stringify(history))
  }, [history])

  const deepSearchRouteNode = useCallback(
    (node: RouteNode, routeName: string): RouteNode | null => {
      if (node.name === routeName) return node

      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const found = deepSearchRouteNode(child, routeName)
          if (found) return found
        }
      }

      return null
    },
    []
  )

  const findNextEnabledRoute = useCallback(
    (nodes: RouteNode[], targetName?: OnboardingRoute): RouteNode | null => {
      if (targetName) {
        const node = nodes.find((n) => n.name === targetName)

        if (!node) return null

        if (!node.disabled) {
          return node
        }

        return findNextEnabledRoute(node.children)
      }

      const firstEnabled = nodes.find((node) => !node.disabled)
      if (firstEnabled) return firstEnabled

      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          const deepEnabled = findNextEnabledRoute(node.children)
          if (deepEnabled) return deepEnabled
        }
      }

      return null
    },
    []
  )

  useEffect(() => {
    const currentRoute = path?.substring(1)
    const prevRoute = prevPath?.substring(1)
    if (!currentRoute) return
    if (!onboardingRoutes.includes(currentRoute)) return
    const node = deepSearchRouteNode(onboardingRoutesTree, currentRoute)

    if (!node) {
      !!prevRoute && navigate(prevRoute, { state: { internal: true } })
      return
    }

    if (node.isProtected) {
      if (!params || !params.internal) {
        !!prevRoute && navigate(prevRoute, { state: { internal: true } })
      }
    }
  }, [path, prevPath, params, deepSearchRouteNode, navigate, onboardingRoutesTree, history])

  const goToNextRoute = useCallback(
    (routeName?: OnboardingRoute, routeParams?: NavigateOptions) => {
      const currentRoute = path?.substring(1)
      if (!currentRoute) return

      let nextRoute: RouteNode | null = null
      if (routeName && onboardingRoutes.includes(routeName)) {
        nextRoute = deepSearchRouteNode(onboardingRoutesTree, routeName)
      } else {
        const currentNode = deepSearchRouteNode(onboardingRoutesTree, currentRoute)
        if (!currentNode) return
        nextRoute = findNextEnabledRoute(currentNode.children, routeName)
      }

      if (nextRoute) {
        navigate(nextRoute.name, {
          state: { ...routeParams, internal: true }
        })
        if (!history.includes(currentRoute)) {
          setHistory((prevHistory) => [...prevHistory, currentRoute])
        }
      }
    },
    [onboardingRoutesTree, findNextEnabledRoute, navigate, deepSearchRouteNode, path, history]
  )

  const goToPrevRoute = useCallback(() => {
    const newHistory = [...history]

    while (newHistory.length > 0) {
      const prevRouteName = newHistory[newHistory.length - 1]
      const prevRoute = deepSearchRouteNode(onboardingRoutesTree, prevRouteName)
      newHistory.pop()
      if (!prevRoute) return
      if (!prevRoute.disabled) {
        navigate(prevRoute.name, { state: { internal: true } })
        setHistory(newHistory)
        return
      }
    }
  }, [history, deepSearchRouteNode, onboardingRoutesTree, navigate])

  useEffect(() => {
    const handleBackButton = () => {
      const changedRoute = window.location.hash.replace('#/', '')
      if (!history.length) return
      if (!onboardingRoutes.includes(changedRoute)) return

      const node = deepSearchRouteNode(onboardingRoutesTree, changedRoute)
      if (!node?.disabled) return

      goToPrevRoute()
    }

    window.addEventListener('hashchange', handleBackButton)

    return () => {
      window.removeEventListener('hashchange', handleBackButton)
    }
  }, [goToPrevRoute, history, deepSearchRouteNode, onboardingRoutesTree])

  const value = useMemo(
    () => ({ isOnboardingRoute, goToNextRoute, goToPrevRoute }),
    [isOnboardingRoute, goToPrevRoute, goToNextRoute]
  )
  return (
    <OnboardingNavigationContext.Provider value={value}>
      {children}
    </OnboardingNavigationContext.Provider>
  )
}

export { OnboardingNavigationContext, OnboardingNavigationProvider }
