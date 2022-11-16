// @ts-nocheck

import { browserAPI } from '@web/constants/browserAPI'

// Update the extension icon depending on the state
export const updateExtensionIcon = async (
  tabId,
  TAB_INJECTIONS,
  PERMISSIONS,
  PENDING_CALLBACKS,
  PENDING_WEB3_RESPONSE_CALLBACKS
) => {
  if (!parseInt(tabId)) return

  tabId = parseInt(tabId)

  browserAPI.tabs.get(tabId, async (tab) => {
    if (tab) {
      let iconUrl
      const tabHost = new URL(tab.url).host

      if (!tab.url.startsWith('http')) {
        iconUrl = browserAPI.runtime.getURL('../assets/images/xicon@128.png')
      } else if (TAB_INJECTIONS[tabId]) {
        if (PERMISSIONS[tabHost] === true) {
          if (Object.keys(PENDING_WEB3_RESPONSE_CALLBACKS).length) {
            iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_pending.png')
          } else {
            iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_connected.png')
          }
        } else if (PERMISSIONS[tabHost] === false) {
          iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_denied.png')
        } else if (PENDING_CALLBACKS[tabHost]) {
          if (!PENDING_CALLBACKS[tabHost].skipIconUpdate) {
            iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_pending.png')
          }
        } else {
          iconUrl = browserAPI.runtime.getURL('../assets/images/xicon@128.png')
        }
      } else {
        iconUrl = browserAPI.runtime.getURL('../assets/images/xicon_connected.png')
      }

      browserAPI.action.setIcon(
        {
          tabId,
          path: iconUrl
        },
        () => true
      )
    }
  })
}
