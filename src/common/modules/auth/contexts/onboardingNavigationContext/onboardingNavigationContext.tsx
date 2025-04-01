/* eslint-disable no-restricted-syntax */
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useRoute from '@common/hooks/useRoute'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

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
] as const

type OnboardingRoute = typeof onboardingRoutes[number]

const OnboardingNavigationContext = createContext<{
  current: RouteNode | null
  goToNextRoute: (routeName?: OnboardingRoute) => void
  goToPrevRoute: () => void
}>({
  current: null,
  goToNextRoute: () => {},
  goToPrevRoute: () => {}
})

class RouteNode {
  name: string

  children: RouteNode[] = []

  disabled: boolean = false

  state?: { [key: string]: any }

  constructor(name: string, children: RouteNode[] = [], disabled = false) {
    this.name = name
    if (children) this.children = children
    this.disabled = disabled
  }

  toJSON() {
    return {
      name: this.name,
      children: this.children,
      disabled: this.disabled
      // skip the state because we store the RouteNode in the session storage
    }
  }
}

const OnboardingNavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const { hasPasswordSecret } = useKeystoreControllerState()
  const { path } = useRoute()
  const { authStatus } = useAuth()

  const onboardingRoutesTree = useMemo(() => {
    const common = [
      new RouteNode(
        WEB_ROUTES.keyStoreSetup,
        [
          new RouteNode(WEB_ROUTES.accountPersonalize, [
            new RouteNode('/'),
            new RouteNode(WEB_ROUTES.accountAdder, [new RouteNode('/')])
          ])
        ],
        hasPasswordSecret
      )
    ]

    return new RouteNode(
      WEB_ROUTES.getStarted,
      [
        new RouteNode(WEB_ROUTES.createSeedPhrasePrepare, [
          new RouteNode(WEB_ROUTES.createSeedPhraseWrite, common)
        ]),
        new RouteNode(WEB_ROUTES.importExistingAccount, [
          new RouteNode(WEB_ROUTES.importPrivateKey, common),
          new RouteNode(WEB_ROUTES.importSeedPhrase, common),
          new RouteNode('ledger', common),
          new RouteNode('trezor', common),
          new RouteNode('grid', common),
          new RouteNode(WEB_ROUTES.importSmartAccountJson, common)
        ]),
        new RouteNode(WEB_ROUTES.viewOnlyAccountAdder, common)
      ],
      authStatus !== AUTH_STATUS.NOT_AUTHENTICATED
    )
  }, [hasPasswordSecret, authStatus])

  const loadState = () => {
    try {
      const savedCurrent = sessionStorage.getItem('onboarding_current')
      const savedHistory = sessionStorage.getItem('onboarding_history')
      if (savedCurrent && savedHistory)
        return { current: JSON.parse(savedCurrent), history: JSON.parse(savedHistory) }
    } catch (error) {
      console.error('Failed to load navigation state:', error)
    }
    return { current: null, history: [] }
  }

  const [current, setCurrent] = useState<RouteNode | null>(loadState().current)
  const [history, setHistory] = useState<string[]>(loadState().history)

  useEffect(() => {
    sessionStorage.setItem('onboarding_current', JSON.stringify(current))
    sessionStorage.setItem('onboarding_history', JSON.stringify(history))
  }, [current, history])

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

  // reset onboarding navigation if needed
  useEffect(() => {
    const currentRoute = path?.substring(1)
    if (!current || !currentRoute) return

    if (!onboardingRoutes.includes(currentRoute)) {
      setCurrent(null)
      setHistory([])
    }
  }, [current, path])

  useEffect(() => {
    if (current) return
    const currentRoute = path?.substring(1)
    if (!currentRoute) return
    if (!onboardingRoutes.includes(currentRoute)) return
    const node: RouteNode | null = deepSearchRouteNode(onboardingRoutesTree, currentRoute)

    if (node) {
      setCurrent(node)
      setHistory([node.name])
    }
  }, [onboardingRoutesTree, current, path, deepSearchRouteNode])

  // Navigate when current route (RouteNode) changes
  useEffect(() => {
    if (!current) return

    const newHash = `#/${current.name}`
    if (window.location.hash !== newHash) window.location.hash = newHash
  }, [current])

  useEffect(() => {
    const enforceNavigation = () => {
      if (!current) return

      const urlRoute = window.location.hash.replace('#/', '') // Extract hash route
      if (!onboardingRoutes.includes(urlRoute)) return

      if (urlRoute !== current.name) {
        window.location.hash = `#/${current.name}` // Force user back to the correct step
      }
    }

    enforceNavigation()
    window.addEventListener('hashchange', enforceNavigation)
    return () => window.removeEventListener('hashchange', enforceNavigation)
  }, [current])

  const goToNextRoute = useCallback(
    (routeName?: OnboardingRoute, params?: any) => {
      const nodes = current ? current.children : [onboardingRoutesTree]
      const nextRoute = findNextEnabledRoute(nodes, routeName)

      if (nextRoute) {
        nextRoute.state = params
        setCurrent(nextRoute)
        setHistory((prevHistory) => [...prevHistory, nextRoute.name])
      }
    },
    [current, onboardingRoutesTree, findNextEnabledRoute]
  )

  const goToPrevRoute = useCallback(() => {
    if (history.length <= 1) {
      console.warn('No previous routes to go back to.')
      return
    }

    const newHistory = [...history]
    newHistory.pop()
    const prevRouteName = newHistory[newHistory.length - 1]
    let prevRoute = deepSearchRouteNode(onboardingRoutesTree, prevRouteName)

    while (prevRoute && prevRoute.disabled && newHistory.length > 1) {
      newHistory.pop()
      prevRoute = deepSearchRouteNode(onboardingRoutesTree, newHistory[newHistory.length - 1])
    }

    if (prevRoute) {
      setCurrent(prevRoute)
      setHistory(newHistory)
    }
  }, [history, deepSearchRouteNode, onboardingRoutesTree])

  console.log(current)
  const value = useMemo(
    () => ({ current, goToNextRoute, goToPrevRoute }),
    [current, goToPrevRoute, goToNextRoute]
  )
  return (
    <OnboardingNavigationContext.Provider value={value}>
      {children}
    </OnboardingNavigationContext.Provider>
  )
}

export { OnboardingNavigationContext, OnboardingNavigationProvider }
