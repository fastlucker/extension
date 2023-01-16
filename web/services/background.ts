import PortMessage from '@web/message/portMessage'
import eventBus from '@web/services/eventBus'

console.log('background', browser?.runtime?.id)

// for page provider
browser.runtime.onConnect.addListener((port) => {
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
              // TODO:
              // return walletController[data.method].apply(null, data.params)
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
    // TODO:
    // const origin = getOriginFromUrl(port.sender.url)
    // const session = sessionService.getOrCreateSession(sessionId, origin)
    const req = { data, session, origin }
    // for background push to respective page
    req.session!.setPortMessage(pm)

    // TODO:
    // return providerController(req)
  })
})
