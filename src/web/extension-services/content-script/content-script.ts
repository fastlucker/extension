/* eslint-disable @typescript-eslint/no-floating-promises */

//
// Content Script is mainly a relayer between pageContext(injected script) and the background service_worker
//

import { nanoid } from 'nanoid'

import { isManifestV3 } from '@web/constants/browserapi'
import { storage } from '@web/extension-services/background/webapi/storage'

import { initializeMessenger } from '../messengers'
import { setupBridgeMessengerRelay } from '../messengers/internal/bridge'

const channelName = nanoid()

const injectProviderScript = () => {
  // the script element with src won't execute immediately use inline script element instead!
  const container = document.head || document.documentElement
  const ele = document.createElement('script')
  let content = ';(function () {'
  if (!isManifestV3) {
    content += `let ambireChannelName = '${channelName}';`
  }
  content += '#PAGEPROVIDER#'
  content += '\n})();'
  ele.textContent = content
  container.insertBefore(ele, container.children[0])
  container.removeChild(ele)
}

const inpageMessenger = initializeMessenger({ connect: 'inpage' })
setupBridgeMessengerRelay()

browser.storage.onChanged.addListener(async (changes: any, namespace: any) => {
  // eslint-disable-next-line no-prototype-builtins
  if (namespace === 'local' && changes.hasOwnProperty('isDefaultWallet')) {
    const isDefaultWallet = JSON.parse(changes.isDefaultWallet.newValue)
    inpageMessenger.send('message', {
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
  inpageMessenger.send('message', {
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
// the injection for manifest v3 is located in background.js
if (!isManifestV3) {
  injectProviderScript()
}
