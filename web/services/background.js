// The most important part of the extension
// background workers are killed and respawned (chrome MV3) when contentScript are calling them. Firefox does not support MV3 yet but is working on it. Fortunately MV3 > MV2 is easier to migrate/support than MV2 > MV3

import {
  setupAmbexMessenger,
  sendReply,
  addMessageHandler,
  setPermissionMiddleware,
  sendMessage,
  sendAck,
  processBackgroundQueue
} from './ambexMessanger.js'
import { IS_FIREFOX, VERBOSE } from '../constants/env.js'
import { STORAGE_CACHED } from '../constants/storage.js'
import { browserAPI } from '../constants/browserAPI.js'

setupAmbexMessenger('background', browserAPI)
setPermissionMiddleware((message, sender, callback) => {
  requestPermission(message, sender, callback)
})

// FF compatibility
if (IS_FIREFOX) {
  browserAPI.action = browserAPI.browserAction
}

// Storage
// which tabs are injected tabId => true
let TAB_INJECTIONS = {}
// permissions host => true/false
let PERMISSIONS = {}
// pending notifications asking for user attention (sign / send tx)
let USER_ACTION_NOTIFICATIONS = {} // Is this storage really necessary?

// find a way to store the state and exec callbacks?
const PENDING_PERMISSIONS_CALLBACKS = {}

const PERMISSION_WINDOWS = {}
const DEFERRED_PERMISSION_WINDOWS = {}

// Dirty hack because of concurrent threads when windows.create that would result in multiple windows popping up
function deferCreateWindow(host, queue) {
  if (!DEFERRED_PERMISSION_WINDOWS[host]) {
    DEFERRED_PERMISSION_WINDOWS[host] = {
      ts: new Date().getTime(),
      count: 0
    }
  } else {
    DEFERRED_PERMISSION_WINDOWS[host].count++
  }
  setTimeout(() => {
    deferTick(host, queue)
  }, 100)
}

async function deferTick(host, queue) {
  if (DEFERRED_PERMISSION_WINDOWS[host]) {
    DEFERRED_PERMISSION_WINDOWS[host] = false
    const zoom = 0.7
    const popupWidth = 600 * zoom
    const popupHeight = 830 * zoom

    // getting last focused window to position our popup correctly
    const lastFocused = await browserAPI.windows.getLastFocused()

    const windowMarginRight = 20
    const windowMarginTop = 80

    const popupLeft = lastFocused.left + lastFocused.width - popupWidth - windowMarginRight
    const popupTop = lastFocused.top + windowMarginTop

    const createData = {
      type: 'panel',
      url: `index.html?host=${host}&queue=${btoa(JSON.stringify(queue))}`,
      width: popupWidth,
      height: popupHeight,
      left: popupLeft,
      top: popupTop
    }
    const creating = browserAPI.windows.create(createData)
    creating.then((c) => {
      PERMISSION_WINDOWS[host] = c.id
      // FF does not place popup correctly on creation so we force update...
      browserAPI.windows.update(c.id, {
        left: popupLeft,
        top: popupTop,
        focused: true,
        drawAttention: true
      })
    })
  }
}

// bool, if worker got initialized
let storageLoaded

// like [].filter but for objects
function filterObject(obj, callback) {
  return Object.fromEntries(Object.entries(obj).filter(([key, val]) => callback(val, key)))
}

function isInjectableTab(tab) {
  return tab && tab.url && tab.url.startsWith('http')
}

// used everywhere when we need to access a consistent state of the background worker
// if not loaded, fill the state vars with last local storage versions
const isStorageLoaded = () =>
  new Promise((res) => {
    if (storageLoaded) return res(STORAGE_CACHED)
    browserAPI.storage.local.get(
      ['TAB_INJECTIONS', 'PERMISSIONS', 'USER_ACTION_NOTIFICATIONS'],
      (result) => {
        TAB_INJECTIONS = { ...TAB_INJECTIONS, ...result.TAB_INJECTIONS }
        PERMISSIONS = { ...PERMISSIONS, ...result.PERMISSIONS }
        USER_ACTION_NOTIFICATIONS = {
          ...USER_ACTION_NOTIFICATIONS,
          ...result.USER_ACTION_NOTIFICATIONS
        }

        storageLoaded = true
        res(true)
      }
    )
  })

// initial loading call
isStorageLoaded()
  .then(() => {
    console.log('IS STORAGE LOADED INIT')
    if (VERBOSE) {
      console.log('initial state loaded')
      console.log('TAB_INJECTIONS', TAB_INJECTIONS)
      console.log('PERMISSIONS', PERMISSIONS)
      console.log('USER_ACTION_NOTIFICATIONS', USER_ACTION_NOTIFICATIONS)
    }

    // when loaded, process the potential messages sent through background
    if (VERBOSE > 1) console.log('process background queue')
    processBackgroundQueue()
  })
  .catch((e) => {
    console.error('storageLoading', e)
  })

// useful for debug, where should I keep it?
/* setTimeout(() => {
  storageLoaded = false
}, 5000) */

// save tab injections in local storage
const saveTabInjections = () => {
  isStorageLoaded().then(() => {
    browserAPI.storage.local.set({ TAB_INJECTIONS: filterObject(TAB_INJECTIONS, (k, v) => v) })
  })
}

// save tab permissions in local storage
const savePermissions = (cb) => {
  isStorageLoaded().then(() => {
    browserAPI.storage.local.set({ PERMISSIONS }, cb)
  })
}

// save user notifications(when interaction required) in local storage
const saveUserActionNotifications = (cb) => {
  isStorageLoaded().then(() => {
    if (VERBOSE > 4) console.debug('saving user action notifications', USER_ACTION_NOTIFICATIONS)
    browserAPI.storage.local.set({ USER_ACTION_NOTIFICATIONS }, cb)
  })
}

// useful for debug purposes, display a notification whenever background worker is reloaded
if (VERBOSE > 1) {
  const testIconURL = chrome.runtime.getURL('../assets/images/extension_enabled.png')
  const notifRand = `${Math.random()}`

  const notificationOptions = {
    type: 'basic',
    iconUrl: testIconURL,
    title: 'RESTARTED',
    priority: 2,
    requireInteraction: false,
    message: '🪅🎀🖼🧸'
  }

  if (IS_FIREFOX) {
    delete notificationOptions.requireInteraction
  }

  browserAPI.notifications.create(`${Math.random()}`, notificationOptions, (data) => {
    setTimeout(() => {
      browserAPI.notifications.clear(notifRand)
    }, 1000)
  })
}

/// /////////////////////////
// HANDLERS START
// vvvvvvvvvvvvvvvvvvvvvvv

// When contentScript is injected, prepare injection of pageContext
addMessageHandler({ type: 'contentScriptInjected' }, (message) => {
  sendReply(message, {
    data: { ack: true }
  })
})

// Save properly injected tabs
addMessageHandler({ type: 'pageContextInjected' }, (message) => {
  if (VERBOSE)
    console.log(
      `[INJECTED TAB ${message.fromTabId}], overridden : ${message.data.overridden}, existing : ${message.data.existing}`
    )
  TAB_INJECTIONS[message.fromTabId] = true
  saveTabInjections()
  updateExtensionIcon(message.fromTabId)
})

// User click reply from auth popup
addMessageHandler({ type: 'grantPermission' }, (message) => {
  if (PENDING_PERMISSIONS_CALLBACKS[message.data.targetHost]) {
    PENDING_PERMISSIONS_CALLBACKS[message.data.targetHost].callbacks.forEach((c) => {
      c(message.data.permitted)
    })
    delete PENDING_PERMISSIONS_CALLBACKS[message.data.targetHost]
  }
  PERMISSIONS[message.data.targetHost] = message.data.permitted
  isStorageLoaded().then(() => {
    savePermissions()
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in TAB_INJECTIONS) {
      updateExtensionIcon(i)
    }
  })

  sendReply(message, {
    data: 'done'
  })
})

// User click reply from auth popup
addMessageHandler({ type: 'getPermissionsList' }, (message) => {
  isStorageLoaded().then(() => {
    sendReply(message, {
      data: PERMISSIONS
    })
  })
})

// User click reply from auth popup
addMessageHandler({ type: 'removeFromPermissionsList' }, (message) => {
  isStorageLoaded().then(() => {
    delete PERMISSIONS[message.data.host]
    savePermissions(() => {
      sendAck(message)
    })
    for (const i in TAB_INJECTIONS) {
      updateExtensionIcon(i)
    }
  })
})

// getting tab status (called from popup)
addMessageHandler({ type: 'getTabStatus' }, (message) => {
  isStorageLoaded().then(async () => {
    let walletInjected = false
    const tabInjected = TAB_INJECTIONS[message.data.tabId]

    // TODO replace by ping?
    await sendMessage({
      type: 'keepalive',
      to: 'ambirePageContext'
    })
      .then((reply) => {
        if (reply && reply.data) {
          walletInjected = true
        }
      })
      .catch((e) => {
        console.warn('No reply from ambire tabs', e)
      })

    sendReply(message, {
      data: {
        walletInjected,
        tabInjected
      }
    })
  })
})

// wrapper for the 2 messageHandlers below
const notifyEventChange = (type, data) => {
  for (const tabId in TAB_INJECTIONS) {
    const callback = (tab) => {
      if (isInjectableTab(tab) && PERMISSIONS[new URL(tab.url).host]) {
        sendMessage(
          {
            toTabId: tab.id,
            to: 'pageContext',
            type,
            data
          },
          { ignoreReply: true }
        )
      }
    }

    if (IS_FIREFOX) {
      try {
        browserAPI.tabs.get(tabId * 1, callback)
      } catch (e) {
        console.log('Error getting tab', e)
      }
    } else {
      browserAPI.tabs
        .get(tabId * 1)
        .then(callback)
        .catch((e) => {
          // ignore
        })
    }
  }

  console.log('NOTIFY EVENT CHANGE....')
  sendMessage(
    {
      to: 'contentScript',
      toTabId: 'extension',
      type,
      data
    },
    { ignoreReply: true }
  )
}

addMessageHandler({ type: 'ambireWalletChainChanged' }, (message) => {
  if (VERBOSE) console.log('BG : broadcasting chainChanged', message)
  isStorageLoaded().then(() => {
    notifyEventChange('ambireWalletChainChanged', { chainId: message.data.chainId })
  })
})

addMessageHandler({ type: 'ambireWalletAccountChanged' }, (message) => {
  if (VERBOSE) console.log('BG : broadcasting accountChanged', message)
  isStorageLoaded().then(() => {
    notifyEventChange('ambireWalletAccountChanged', { account: message.data.account })
  })
})

addMessageHandler({ type: 'userInterventionNotification' }, (message) => {
  isStorageLoaded().then(() => {
    const notificationId = `ambireNotification${Math.random()}`
    USER_ACTION_NOTIFICATIONS[notificationId] = true
    saveUserActionNotifications()

    const createNotification = () => {
      const iconURL = chrome.runtime.getURL('../assets/images/extension_enabled.png')

      const notificationOptions = {
        type: 'basic',
        iconUrl: iconURL,
        title: 'Ambire Wallet',
        priority: 2,
        requireInteraction: true,
        message: '🔥 Ambire wallet: Action requested. Click here to open ambire wallet'
      }

      if (IS_FIREFOX) {
        delete notificationOptions.requireInteraction
      }

      browserAPI.notifications.create(notificationId, notificationOptions, (data) => {
        // probably wont be triggered because of extension unloading
        setTimeout(() => {
          browserAPI.notifications.clear(notificationId)
          delete USER_ACTION_NOTIFICATIONS[notificationId]
          saveUserActionNotifications()
        }, 30 * 1000)
      })
    }

    if (IS_FIREFOX) {
      createNotification()
    } else {
      browserAPI.notifications.getPermissionLevel((level) => {
        if (level === 'granted') {
          createNotification()
        } else {
          console.log('extension does not have permissions to show notifications')
        }
      })
    }
  })
})

addMessageHandler({ type: 'openAuthPopup' }, (message) => {
  isStorageLoaded().then(() => {
    // Might want to pile up msgs with debounce in future
    openAuthPopup(message.data.host, [message])
  })
})

// ^^^^^^^^^^^^^^^^^^^^^^^^^^
// HANDLERS END
/// /////////////////////////

const openAuthPopup = async (host, queue) => {
  // for some reason, chrome defined at the top, at this moment of code execution does not return any windows information but browser (which is supposed to alias chrome) has
  // fixed with browserAPI = browser || chrome instead of the opposite
  // If there is a popup window open for this host in our cache
  if (PERMISSION_WINDOWS[host] > 0) {
    // check if the window is still there
    const win = await browserAPI.windows.get(PERMISSION_WINDOWS[host]).catch((e) => {
      console.warn('err win', e)
    })
    console.warn(`winPromise of ${PERMISSION_WINDOWS[host]}`, win)
    if (!win) {
      delete PERMISSION_WINDOWS[host]
    } else {
      // making sure the popup comes back on top
      browserAPI.windows.update(win.id, {
        focused: true,
        drawAttention: true
      })
    }
  }

  if (!PERMISSION_WINDOWS[host]) {
    console.warn(
      `creating window because permission windows for ${host} is ${PERMISSION_WINDOWS[host]}`
    )
    PERMISSION_WINDOWS[host] = -1 // pending creation
    deferCreateWindow(host, queue)
  }
}

// returns wether a message is allow to transact or if host is unknown, show permission popup
const requestPermission = async (message, sender, callback) => {
  const host = new URL(sender.origin || sender.url).host
  message.fromTabId = sender.tab.id

  if (PERMISSIONS[host] === true) {
    if (VERBOSE) console.log(`Host whitelisted ${host}`)
    callback(true)
  } else if (PERMISSIONS[host] === false) {
    if (VERBOSE) console.log(`Host blacklisted ${host}`)
    callback(false)
  } else {
    let diff
    if (PENDING_PERMISSIONS_CALLBACKS[host]) {
      diff = new Date().getTime() - PENDING_PERMISSIONS_CALLBACKS[host].requestTimestamp
    }
    if (PENDING_PERMISSIONS_CALLBACKS[host] && diff < 10 * 1000) {
      if (VERBOSE) console.log(`already callback pending for ${host} ${diff / 1000} secs ago...`)
      PENDING_PERMISSIONS_CALLBACKS[host].callbacks.push((permitted) => {
        PERMISSIONS[host] = permitted
        savePermissions()
        callback(permitted)
      })
    } else {
      if (VERBOSE) console.log(`setting pending callback for ${host}`)

      // check if tab will receive it
      browserAPI.tabs.get(message.fromTabId, async (tab) => {
        if (!tab) {
          console.warn('No matching tab found for permission request', message)
          return
        }

        PENDING_PERMISSIONS_CALLBACKS[host] = {
          requestTimestamp: new Date().getTime(),
          callbacks: []
        }

        PENDING_PERMISSIONS_CALLBACKS[host].callbacks.push((permitted) => {
          PERMISSIONS[host] = permitted
          browserAPI.storage.sync.set({ permittedHosts: PERMISSIONS }, () => {
            if (VERBOSE) console.log('permissions saved')
          })
          callback(permitted)
        })

        console.log('2')
        updateExtensionIcon(message.fromTabId)

        // Might want to pile up msgs with debounce in future
        openAuthPopup(host, [message])
      })
    }
  }
}

// update the extension icon depending on the state
const updateExtensionIcon = async (tabId) => {
  if (!parseInt(tabId)) return

  tabId = parseInt(tabId)

  browserAPI.tabs.get(tabId, async (tab) => {
    if (tab) {
      await isStorageLoaded()

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
