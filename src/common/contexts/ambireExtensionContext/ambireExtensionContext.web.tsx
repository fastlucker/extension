import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useExtensionWallet from '@common/hooks/useExtensionWallet'
import alert from '@common/services/alert'
import { getCurrentTab } from '@web/background/webapi/tab'
import { isExtension } from '@web/constants/browserapi'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'

import { ambireExtensionContextDefaults, AmbireExtensionContextReturnType } from './types'

const AmbireExtensionContext = createContext<AmbireExtensionContextReturnType>(
  ambireExtensionContextDefaults
)

const ExtensionProvider: React.FC<any> = ({ children }) => {
  const { t } = useTranslation()
  const { extensionWallet } = useExtensionWallet()
  const [site, setSite] = useState<AmbireExtensionContextReturnType['site']>(null)
  const [connectedDapps, setConnectedDapps] = useState<
    AmbireExtensionContextReturnType['connectedDapps']
  >([])

  const getCurrentSite = useCallback(async () => {
    const tab = await getCurrentTab()
    if (!tab.id || !tab.url) return
    const domain = getOriginFromUrl(tab.url)
    const current = await extensionWallet!.getCurrentSite(tab.id, domain)
    setSite(current)
  }, [extensionWallet])

  const getConnectedSites = useCallback(async () => {
    const connectedSites = await extensionWallet!.getConnectedSites()
    setConnectedDapps(connectedSites)
  }, [extensionWallet])

  useEffect(() => {
    getCurrentSite()
    getConnectedSites()
  }, [getCurrentSite, getConnectedSites])

  const disconnectDapp = useCallback<AmbireExtensionContextReturnType['disconnectDapp']>(
    (origin) => {
      const siteToDisconnect = connectedDapps.find((x) => x.origin === origin)

      if (!siteToDisconnect) {
        return
      }

      const disconnect = async () => {
        await extensionWallet!.removeConnectedSite(origin)
        getCurrentSite()
        getConnectedSites()
      }

      alert(
        t('Are you sere you want to disconnect {{name}} ({{url}})?', {
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
    [connectedDapps, extensionWallet, getConnectedSites, getCurrentSite, t]
  )

  return (
    <AmbireExtensionContext.Provider
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
    </AmbireExtensionContext.Provider>
  )
}

// To avoid conflicts in web only environment
const AmbireExtensionProvider = isExtension ? ExtensionProvider : ({ children }: any) => children

export { AmbireExtensionContext, AmbireExtensionProvider }
