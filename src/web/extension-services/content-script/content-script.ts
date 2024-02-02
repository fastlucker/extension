/* eslint-disable @typescript-eslint/no-floating-promises */

//
// Content Script is mainly a relayer between pageContext(injected script) and the background service_worker
//

import { nanoid } from 'nanoid'

import { isManifestV3 } from '@web/constants/browserapi'
import BroadcastChannelMessage from '@web/extension-services/message/broadcastChannelMessage'
import PortMessage from '@web/extension-services/message/portMessage'

import { storage } from '../background/webapi/storage'

const channelName = nanoid()
window.name = `ambire-${channelName}`

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

// we run this content script in all_frames (see the manifest file) for better injection
// but we want the BroadcastChannelMessage to send messages to the service_worker/background only from one of the frames
// to avoid duplicated requests (window.top is the top-level frame)
if (window === window.top) {
  const pm = new PortMessage().connect()
  const bcm = new BroadcastChannelMessage(
    window.name.startsWith('ambire-') ? window.name : !isManifestV3 ? channelName : 'ambire-inpage'
  ).listen((data: any) => {
    return pm.request(data)
  })

  // messages coming from the background service and will be passed to the injected script (handled in inpage.ts)
  pm.on('message', (data) => bcm.send('message', data))

  document.addEventListener('beforeunload', () => {
    bcm.dispose()
    pm.dispose()
  })

  browser.storage.onChanged.addListener(async (changes: any, namespace: any) => {
    // eslint-disable-next-line no-prototype-builtins
    if (namespace === 'local' && changes.hasOwnProperty('isDefaultWallet')) {
      const isDefaultWallet = JSON.parse(changes.isDefaultWallet.newValue)
      bcm.send('message', {
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
    bcm.send('message', {
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
}

// the injection for manifest v3 is located in background.js
if (!isManifestV3) {
  injectProviderScript()
}
