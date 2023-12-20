// @ts-nocheck

// Content Script is mainly a relayer between pageContext(injected script) and the background service_worker

import { isManifestV3 } from '@web/constants/browserapi'
import BroadcastChannelMessage from '@web/extension-services/message/broadcastChannelMessage'
import PortMessage from '@web/extension-services/message/portMessage'

const injectProviderScript = () => {
  // the script element with src won't execute immediately
  // use inline script element instead!
  const container = document.head || document.documentElement
  const ele = document.createElement('script')
  // in prevent of webpack optimized code do some magic(e.g. double/sigle quote wrap),
  // seperate content assignment to two line
  // use AssetReplacePlugin to replace pageprovider content
  let content = ';(function () {'
  content += '#PAGEPROVIDER#'
  content += '\n})();'
  ele.textContent = content
  container.insertBefore(ele, container.children[0])
  container.removeChild(ele)
}

const pm = new PortMessage().connect()

const bcm = new BroadcastChannelMessage('ambire-inpage').listen((data) => pm.request(data))

// background notification
pm.on('message', (data) => bcm.send('message', data))

document.addEventListener('beforeunload', () => {
  bcm.dispose()
  pm.dispose()
})

// the injection for manifest v3 is located in background.js
if (!isManifestV3) {
  injectProviderScript()
}
