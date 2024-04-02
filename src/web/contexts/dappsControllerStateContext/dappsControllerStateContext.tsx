/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { DappsController } from '@web/extension-services/background/controllers/dapps'
import permission, { ConnectedSite } from '@web/extension-services/background/services/permission'
import { Session } from '@web/extension-services/background/services/session'
import { getCurrentTab } from '@web/extension-services/background/webapi/tab'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'

// @ts-ignore
interface DappControllerState extends DappsController {
  dappsSessionMap: {
    [k: string]: Session
  }
}

const DappsControllerStateContext = createContext<{
  state: DappControllerState
  currentDapp: ConnectedSite | null
  getIsDappConnected: (origin: string) => boolean
  getDappSession: (origin: string) => ConnectedSite | undefined
}>({
  state: {} as DappControllerState,
  currentDapp: null,
  getIsDappConnected: () => false,
  getDappSession: () => undefined
})

const DappsControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as DappControllerState)
  const [currentDapp, setCurrentDapp] = useState<ConnectedSite | null>(null)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      await permission.init()
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'dapps' }
      })
    })()
  }, [dispatch])

  useEffect(() => {
    const onUpdate = async (newState: DappControllerState) => {
      setState(newState)

      const tab = await getCurrentTab()
      if (!tab.id || !tab.url) return
      const domain = getOriginFromUrl(tab.url)

      const {
        origin: dappOrigin,
        name,
        icon
      } = newState.dappsSessionMap?.[`${tab.id}-${domain}`] || {}

      const site = permission.getSite(dappOrigin)
      if (site) {
        setCurrentDapp(site)
      } else if (name && icon) {
        setCurrentDapp({
          origin: dappOrigin,
          name,
          icon,
          isConnected: false,
          isSigned: false,
          isTop: false
        } as ConnectedSite)
      }
    }

    eventBus.addEventListener('dapps', onUpdate)

    return () => eventBus.removeEventListener('dapps', onUpdate)
  }, [])

  const getIsDappConnected = useCallback((origin: string) => {
    return !!permission.hasPermission(origin)
  }, [])

  const getDappSession = useCallback((origin: string) => {
    return permission.getSite(origin)
  }, [])

  return (
    <DappsControllerStateContext.Provider
      value={useMemo(
        () => ({
          state,
          currentDapp,
          getIsDappConnected,
          getDappSession
        }),
        [state, currentDapp, getIsDappConnected, getDappSession]
      )}
    >
      {children}
    </DappsControllerStateContext.Provider>
  )
}

export { DappsControllerStateProvider, DappsControllerStateContext }
