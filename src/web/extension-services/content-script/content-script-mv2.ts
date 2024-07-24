/* eslint-disable @typescript-eslint/no-floating-promises */

//
// Content Script is mainly a relayer between pageContext(injected script) and the background service_worker
//

import { storage } from '@web/extension-services/background/webapi/storage'

import { initializeMessenger } from '../messengers'
import { setupBridgeMessengerRelay } from '../messengers/internal/bridge'

const injectProviderScript = () => {
  // the script element with src won't execute immediately use inline script element instead!
  const container = document.head || document.documentElement
  const ambireInpageScript = document.createElement('script')
  const ethereumInpageScript = document.createElement('script')
  // Otherwise the script will mess with the global scope of the page
  ambireInpageScript.type = 'module'
  ethereumInpageScript.type = 'module'

  // '#AMBIREINPAGE#' and '#ETHEREUMINPAGE#' are strings replaced by webpack
  // via the AssetReplacePlugin with the real content of each file
  ambireInpageScript.textContent = '#AMBIREINPAGE#'
  container.insertBefore(ambireInpageScript, container.children[0])
  ethereumInpageScript.textContent = '#ETHEREUMINPAGE#'
  container.insertBefore(ethereumInpageScript, container.children[1])
  container.removeChild(ambireInpageScript)
  container.removeChild(ethereumInpageScript)
}

injectProviderScript()

setupBridgeMessengerRelay()

const inpageMessenger = initializeMessenger({ connect: 'inpage' })
browser.storage.onChanged.addListener(async (changes: any, namespace: any) => {
  // eslint-disable-next-line no-prototype-builtins
  if (namespace === 'local' && changes.hasOwnProperty('isDefaultWallet')) {
    const isDefaultWallet = JSON.parse(changes.isDefaultWallet.newValue)
    inpageMessenger.send('broadcast', {
      data: {
        type: 'setDefaultWallet',
        value: isDefaultWallet ? 'AMBIRE' : 'OTHER',
        shouldReload: true
      }
    })
  }
})

const initIsDefaultWallet = async () => {
  const isDefaultWallet = await storage.get('isDefaultWallet', true)
  inpageMessenger.send('broadcast', {
    data: {
      type: 'setDefaultWallet',
      value: isDefaultWallet ? 'AMBIRE' : 'OTHER',
      shouldReload: false
    }
  })
}

setTimeout(() => {
  initIsDefaultWallet()
}, 1)
