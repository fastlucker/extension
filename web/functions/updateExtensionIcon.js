import { browserAPI } from '../constants/browserAPI.js'
import { getStorage } from './storage.js'
import { VERBOSE } from '../constants/env.js'

// update the extension icon depending on the state
export const updateExtensionIcon = async (tabId, PENDING_PERMISSIONS_CALLBACKS) => {
  const storage = await getStorage(['TAB_INJECTIONS', 'PERMISSIONS'])
  const TAB_INJECTIONS = storage.TAB_INJECTIONS || {}
  const PERMISSIONS = storage.PERMISSIONS || {}

  if (!parseInt(tabId)) return

  tabId = parseInt(tabId)

  browserAPI.tabs.get(tabId, async (tab) => {
    if (tab) {
      let iconUrl

      if (!tab.url.startsWith('http')) {
        iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_disabled.png')
      } else {
        const tabHost = new URL(tab.url).host
        if (TAB_INJECTIONS[tabId]) {
          if (PERMISSIONS[tabHost] === true) {
            iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_connected.png')
          } else if (PERMISSIONS[tabHost] === false) {
            iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_denied.png')
          } else if (PENDING_PERMISSIONS_CALLBACKS[tabHost]) {
            iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_pending.png')
          } else {
            iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_disabled.png')
          }
        } else {
          iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_connected.png')
        }
      }

      if (VERBOSE) console.log(`setting icon for tab ${tabId} ${iconUrl}`)
      browserAPI.action.setIcon(
        {
          tabId,
          path: iconUrl
        },
        () => true
      )
    } else {
      console.warn(`No tabs found for id ${tabId}`)
    }
  })
}
