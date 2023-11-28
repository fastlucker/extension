// Content Script is mainly a relayer between pageContext(injected script) and the background service_worker
import { nanoid } from 'nanoid'
import { v4 as uuid } from 'uuid'

import BroadcastChannelMessage from '@web/extension-services/message/broadcastChannelMessage'
import PortMessage from '@web/extension-services/message/portMessage'

const channelName = nanoid()
// we need an additional check for Opera because
// there are some differences in the injection of the provider in inpage.ts
const isOpera = /Opera|OPR\//i.test(navigator.userAgent)

const injectProviderScript = (isDefaultWallet: boolean) => {
  // the script element with src won't execute immediately use inline script element instead!
  const container = document.head || document.documentElement
  const ele = document.createElement('script')
  let content = ';(function () {'
  content += `const ambireChannelName = '${channelName}';`
  content += `const ambireIsDefaultWallet = ${isDefaultWallet};`
  content += `const ambireId = '${uuid()}';`
  content += `const ambireIsOpera = ${isOpera};`
  // PAGEPROVIDER comes from webpack to inject the content of the inpage.ts file into the webpage
  content += '#PAGEPROVIDER#'
  content += '\n})();'
  ele.textContent = content
  container.insertBefore(ele, container.children[0])
  container.removeChild(ele)
}

const pm = new PortMessage().connect()

// messages coming from inpage.ts will be passed to the background service (handled by pm.listen(...))
const bcm = new BroadcastChannelMessage(channelName).listen((data: any) => pm.request(data))

// messages coming from the background service and will be passed to the injected script (handled in inpage.ts)
pm.on('message', (data) => bcm.send('message', data))

document.addEventListener('beforeunload', () => {
  bcm.dispose()
  pm.dispose()
})

if (isOpera) {
  injectProviderScript(false)
} else {
  injectProviderScript(true)
}

// TODO: keep alive for manifest v3
// const WORKER_KEEP_ALIVE_INTERVAL = 1000
// const WORKER_KEEP_ALIVE_MESSAGE = 'WORKER_KEEP_ALIVE_MESSAGE'

// const initKeepWorkerAlive = () => {
//   setInterval(() => {
//     browserapi.runtime.sendMessage({ name: WORKER_KEEP_ALIVE_MESSAGE })
//   }, WORKER_KEEP_ALIVE_INTERVAL)
// }

// // Keeps service_worker alive (prevents it to become inactive)
// if (engine === 'webkit') {
//   initKeepWorkerAlive()
// }
