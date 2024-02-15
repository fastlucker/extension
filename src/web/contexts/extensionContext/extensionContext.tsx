import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import alert from '@common/services/alert'
import { isExtension } from '@web/constants/browserapi'
import { getCurrentTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'

import { extensionContextDefaults, ExtensionContextReturnType } from './types'

const ExtensionContext = createContext<ExtensionContextReturnType>(extensionContextDefaults)

const Provider: React.FC<any> = ({ children }) => {
  const { t } = useTranslation()
  const { dispatch, dispatchAsync } = useBackgroundService()
  const [site, setSite] = useState<ExtensionContextReturnType['site']>(null)
  const [connectedDapps, setConnectedDapps] = useState<
    ExtensionContextReturnType['connectedDapps']
  >([])

  const getCurrentSite = useCallback(async () => {
    const tab = await getCurrentTab()
    if (!tab.id || !tab.url) return
    const domain = getOriginFromUrl(tab.url)
    const current = await dispatchAsync({
      type: 'WALLET_CONTROLLER_GET_CURRENT_SITE',
      params: { tabId: tab.id, domain }
    })
    setSite(current)
  }, [dispatchAsync])

  const getConnectedSites = useCallback(async () => {
    const connectedSites = await dispatchAsync({ type: 'WALLET_CONTROLLER_GET_CONNECTED_SITES' })
    setConnectedDapps(connectedSites)
  }, [dispatchAsync])

  useEffect(() => {
    getCurrentSite()
    getConnectedSites()
  }, [getCurrentSite, getConnectedSites])

  const disconnectDapp = useCallback<ExtensionContextReturnType['disconnectDapp']>(
    (origin) => {
      const siteToDisconnect = connectedDapps.find((x) => x.origin === origin)

      if (!siteToDisconnect) {
        return
      }

      const disconnect = async () => {
        await dispatch({ type: 'WALLET_CONTROLLER_REMOVE_CONNECTED_SITE', params: { origin } })
        getCurrentSite()
        getConnectedSites()
      }

      alert(
        t('Are you sure you want to disconnect {{name}} ({{url}})?', {
          name: siteToDisconnect.name,
          url: siteToDisconnect.origin
        }),
        undefined,
        [
          { text: t('Disconnect'), onPress: disconnect, style: 'destructive' },
          { text: t('Cancel'), style: 'cancel' }
        ]
      )
    },
    [connectedDapps, dispatch, getConnectedSites, getCurrentSite, t]
  )

  return (
    <ExtensionContext.Provider
      value={useMemo(
        () => ({
          connectedDapps,
          site,
          disconnectDapp
        }),
        [connectedDapps, site, disconnectDapp]
      )}
    >
      {children}
    </ExtensionContext.Provider>
  )
}

// To avoid conflicts in web only environment
const ExtensionProvider = isExtension ? Provider : ({ children }: any) => children

export { ExtensionContext, ExtensionProvider }
