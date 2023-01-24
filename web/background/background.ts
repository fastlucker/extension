import providerController from '@web/background/provider/provider'
import sessionService from '@web/background/services/session'
import { WalletController } from '@web/background/wallet'
import eventBus from '@web/event/eventBus'
import PortMessage from '@web/message/portMessage'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'

import permissionService from './services/permission'

async function restoreAppState() {
  await permissionService.init()
}

restoreAppState()

// for page provider
browser.runtime.onConnect.addListener((port) => {
  // TODO:
  if (port.name === 'popup' || port.name === 'notification' || port.name === 'tab') {
    const pm = new PortMessage(port)
    pm.listen((data) => {
      if (data?.type) {
        switch (data.type) {
          case 'broadcast':
            eventBus.emit(data.method, data.params)
            break
          case 'controller':
          default:
            if (data.method) {
              return WalletController[data.method].apply(null, data.params)
            }
        }
      }
    })

    const boardcastCallback = (data: any) => {
      pm.request({
        type: 'broadcast',
        method: data.method,
        params: data.params
      })
    }

    if (port.name === 'popup') {
      // TODO:
      // preferenceService.setPopupOpen(true)

      port.onDisconnect.addListener(() => {
        // TODO:
        // preferenceService.setPopupOpen(false)
      })
    }
    eventBus.addEventListener('broadcastToUI', boardcastCallback)
    port.onDisconnect.addListener(() => {
      eventBus.removeEventListener('broadcastToUI', boardcastCallback)
    })

    return
  }

  if (!port.sender?.tab) {
    return
  }

  const pm = new PortMessage(port)

  pm.listen(async (data) => {
    // TODO:
    // if (!appStoreLoaded) {
    //   throw ethErrors.provider.disconnected()
    // }

    const sessionId = port.sender?.tab?.id
    if (sessionId === undefined || !port.sender?.url) {
      return
    }

    const origin = getOriginFromUrl(port.sender.url)
    const session = sessionService.getOrCreateSession(sessionId, origin)
    const req = { data, session, origin }
    // for background push to respective page
    req.session!.setPortMessage(pm)

    return providerController(req)
  })
})
