/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

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
}>({
  state: {} as DappControllerState,
  currentDapp: null
})

const DappsControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as DappControllerState)
  const [currentDapp, setCurrentDapp] = useState<ConnectedSite | null>(null)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: 'dapps' }
    })
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

      await permission.init()
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

  return (
    <DappsControllerStateContext.Provider
      value={useMemo(
        () => ({
          state,
          currentDapp
        }),
        [state, currentDapp]
      )}
    >
      {children}
    </DappsControllerStateContext.Provider>
  )
}

export { DappsControllerStateProvider, DappsControllerStateContext }
