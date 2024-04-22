/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { Dapp, DappsController } from '@web/extension-services/background/controllers/dapps'
import { Session } from '@web/extension-services/background/services/session'
import { getCurrentTab } from '@web/extension-services/background/webapi/tab'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'
import { flushSync } from 'react-dom'

// @ts-ignore
interface DappControllerState extends DappsController {
  dappsSessionMap: {
    [k: string]: Session
  }
}

const DappsControllerStateContext = createContext<{
  state: DappControllerState
  currentDapp: Dapp | null
}>({
  state: {} as DappControllerState,
  currentDapp: null
})

const DappsControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as DappControllerState)
  const [currentDapp, setCurrentDapp] = useState<Dapp | null>(null)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: 'dapps' }
    })
  }, [dispatch])

  useEffect(() => {
    const onUpdate = async (newState: DappControllerState, forceEmit?: boolean) => {
      if (forceEmit) {
        flushSync(() => setState(newState))
      } else {
        setState(newState)
      }

      const tab = await getCurrentTab()
      if (!tab.id || !tab.url) return
      const domain = getOriginFromUrl(tab.url)

      const currentSession = newState.dappsSessionMap?.[`${tab.id}-${domain}`] || {}

      const dapp = newState.dapps.find((d) => d.url === currentSession.origin)

      if (dapp) {
        setCurrentDapp(dapp)
      } else if (currentSession.name && currentSession.icon) {
        setCurrentDapp({
          url: currentSession.origin,
          name: currentSession.name,
          icon: currentSession.icon,
          isConnected: false,
          description: '',
          chainId: 1,
          favorite: false
        })
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
