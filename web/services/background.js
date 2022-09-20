// The most important part of the extension
// background workers are killed and respawned (chrome MV3) when contentScript are calling them. Firefox does not support MV3 yet but is working on it. Fortunately MV3 > MV2 is easier to migrate/support than MV2 > MV3
import { getDefaultProvider, BigNumber, ethers } from '../modules/ethers.esm.min.js'

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
import { browserAPI } from '../constants/browserAPI.js'
import { updateExtensionIcon } from '../functions/updateExtensionIcon.js'
import {
  TAB_INJECTIONS,
  PERMISSIONS,
  USER_ACTION_NOTIFICATIONS,
  NETWORK,
  SELECTED_ACCOUNT,
  isStorageLoaded,
  saveTabInjectionsInStorage,
  savePermissionsInStorage,
  saveUserActionNotificationsInStorage,
  setSelectedAccount,
  setNetwork
} from '../functions/storage.js'

setupAmbexMessenger('background', browserAPI)
setPermissionMiddleware((message, sender, callback) => {
  requestPermission(message, sender, callback)
})

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
      url: `index.html?initialRoute=permission-request&host=${host}&queue=${btoa(
        JSON.stringify(queue)
      )}`,
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

function isInjectableTab(tab) {
  return tab && tab.url && tab.url.startsWith('http')
}

const storageChangeListener = () => {
  isStorageLoaded().then(() => {
    if (NETWORK.chainId && SELECTED_ACCOUNT) {
      notifyEventChange('ambireWalletConnected', {
        account: SELECTED_ACCOUNT,
        chainId: NETWORK.chainId
      })
      // updateExtensionIcon(tabId * 1, TAB_INJECTIONS, PERMISSIONS, PENDING_PERMISSIONS_CALLBACKS)
    }
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, { newValue }] of Object.entries(changes)) {
          if (key === 'SELECTED_ACCOUNT') {
            setSelectedAccount(newValue)
            if (VERBOSE) console.log('BG : broadcasting accountChanged')
            notifyEventChange('ambireWalletAccountChanged', { account: newValue })
          }
          if (key === 'NETWORK') {
            setNetwork(newValue)
            if (VERBOSE) console.log('BG : broadcasting chainChanged')
            notifyEventChange('ambireWalletChainChanged', { chainId: newValue.chainId })
          }
        }
      }
    })
  })
}

// Initial loading call
isStorageLoaded()
  .then(() => {
    processBackgroundQueue()
  })
  .catch((e) => {
    console.error('storageLoading', e)
  })

storageChangeListener()

// useful for debug, where should I keep it?
/* setTimeout(() => {
  storageLoaded = false
}, 5000) */

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
  saveTabInjectionsInStorage()
  updateExtensionIcon(message.fromTabId, TAB_INJECTIONS, PERMISSIONS, PENDING_PERMISSIONS_CALLBACKS)
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
    savePermissionsInStorage()
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in TAB_INJECTIONS) {
      updateExtensionIcon(i, TAB_INJECTIONS, PERMISSIONS, PENDING_PERMISSIONS_CALLBACKS)
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

addMessageHandler({ type: 'removeFromPermissionsList' }, (message) => {
  isStorageLoaded().then(() => {
    delete PERMISSIONS[message.data.host]
    savePermissionsInStorage(() => {
      sendAck(message)
    })
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in TAB_INJECTIONS) {
      updateExtensionIcon(i, TAB_INJECTIONS, PERMISSIONS, PENDING_PERMISSIONS_CALLBACKS)
    }
  })
})

const sanitize2hex = (any) => {
  if (VERBOSE > 2) console.warn(`instanceof of any is ${any instanceof BigNumber}`)
  if (any instanceof BigNumber) {
    return any.toHexString()
  }

  if (any === undefined || any === null) {
    return any
  }
  return BigNumber.from(any).toHexString()
}

// Handling web3 calls
addMessageHandler({ type: 'web3Call' }, async (message) => {
  isStorageLoaded().then(async () => {
    if (!NETWORK || !SELECTED_ACCOUNT) {
      sendReply(message, {
        error: 'Error'
      })
      return
    }
    VERBOSE > 0 && console.log('ambirePC: web3CallRequest', message)
    const provider = getDefaultProvider(NETWORK.rpc)

    const payload = message.data
    const method = payload.method

    let deferredReply = false

    const callTx = payload.params
    let result
    let error
    if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
      result = [SELECTED_ACCOUNT]
    } else if (method === 'eth_chainId' || method === 'net_version') {
      result = ethers.utils.hexlify(NETWORK.chainId)
    } else if (method === 'wallet_requestPermissions') {
      result = [{ parentCapability: 'eth_accounts' }]
    } else if (method === 'wallet_getPermissions') {
      result = [{ parentCapability: 'eth_accounts' }]
    } else if (method === 'wallet_switchEthereumChain') {
      // TODO:
      // const existingNetwork = allNetworks.find((a) => {
      //   return sanitize2hex(a.chainId) === sanitize2hex(callTx[0]?.chainId) // ethers BN ouputs 1 to 0x01 while some dapps ask for 0x1
      // })
      // if (existingNetwork) {
      //   setNetwork(existingNetwork.chainId)
      //   result = null
      // } else {
      //   error = `chainId ${callTx[0]?.chainId} not supported by ambire wallet`
      // }
    } else if (method === 'eth_coinbase') {
      result = SELECTED_ACCOUNT
    } else if (method === 'eth_call') {
      result = await provider.call(callTx[0], callTx[1]).catch((err) => {
        error = err
      })
    } else if (method === 'eth_getBalance') {
      result = await provider.getBalance(callTx[0], callTx[1]).catch((err) => {
        error = err
      })
      if (result) {
        result = sanitize2hex(result)
      }
    } else if (method === 'eth_blockNumber') {
      result = await provider.getBlockNumber().catch((err) => {
        error = err
      })
      if (result) result = sanitize2hex(result)
    } else if (method === 'eth_getBlockByHash') {
      if (callTx[1]) {
        result = await provider.getBlockWithTransactions(callTx[0]).catch((err) => {
          error = err
        })
        if (result) {
          result.baseFeePerGas = sanitize2hex(result.baseFeePerGas)
          result.gasLimit = sanitize2hex(result.gasLimit)
          result.gasUsed = sanitize2hex(result.gasUsed)
          result._difficulty = sanitize2hex(result._difficulty)
        }
      } else {
        result = await provider.getBlock(callTx[0]).catch((err) => {
          error = err
        })
      }
    } else if (method === 'eth_getTransactionByHash') {
      result = await provider.getTransaction(callTx[0]).catch((err) => {
        error = err
      })
      if (result) {
        // sanitize
        // need to return hex numbers, provider returns BigNumber
        result.gasLimit = sanitize2hex(result.gasLimit)
        result.gasPrice = sanitize2hex(result.gasPrice)
        result.value = sanitize2hex(result.value)
        result.wait = null
      }
    } else if (method === 'eth_getCode') {
      result = await provider.getCode(callTx[0], callTx[1]).catch((err) => {
        error = err
      })
    } else if (method === 'eth_gasPrice') {
      result = await provider.getGasPrice().catch((err) => {
        error = err
      })
      if (result) result = sanitize2hex(result)
    } else if (method === 'eth_estimateGas') {
      result = await provider.estimateGas(callTx[0]).catch((err) => {
        error = err
      })
      if (result) result = sanitize2hex(result)
    } else if (method === 'eth_getBlockByNumber') {
      result = await provider.getBlock(callTx[0], callTx[1]).catch((err) => {
        error = err
      })
      if (result) {
        result.baseFeePerGas = sanitize2hex(result.baseFeePerGas)
        result.gasLimit = sanitize2hex(result.gasLimit)
        result.gasUsed = sanitize2hex(result.gasUsed)
        result._difficulty = sanitize2hex(result._difficulty)
      }
      VERBOSE > 2 && console.log('Result', result, error)
    } else if (method === 'eth_getTransactionReceipt') {
      result = await provider.getTransactionReceipt(callTx[0]).catch((err) => {
        error = err
      })
      if (result) {
        result.cumulativeGasUsed = sanitize2hex(result.cumulativeGasUsed)
        result.effectiveGasPrice = sanitize2hex(result.effectiveGasPrice)
        result.gasUsed = sanitize2hex(result.gasUsed)
        result._difficulty = sanitize2hex(result._difficulty)
      }
    } else if (method === 'eth_getTransactionCount') {
      result = await provider.getTransactionCount(callTx[0]).catch((err) => {
        error = err
      })
      if (result) result = sanitize2hex(result)
    } else if (method === 'personal_sign') {
      // TODO:
      // handlePersonalSign(message).catch((err) => {
      //   verbose > 0 && console.log('personal sign error ', err)
      //   error = err
      // })
      deferredReply = true
    } else if (method === 'eth_sign') {
      // TODO:
      // handlePersonalSign(message).catch((err) => {
      //   verbose > 0 && console.log('personal sign error ', err)
      //   error = err
      // })
      deferredReply = true
    } else if (method === 'eth_sendTransaction') {
      deferredReply = true
      // TODO:
      // await handleSendTransactions(message).catch((err) => {
      //   error = err
      // })
    } else if (method === 'gs_multi_send' || method === 'ambire_sendBatchTransaction') {
      deferredReply = true
      // TODO:
      // await handleSendTransactions(message).catch((err) => {
      //   error = err
      // })
    } else {
      error = `Method not supported by extension hook: ${method}`
    }

    if (error) {
      console.error('throwing error with ', message)
      sendReply(message, {
        data: {
          jsonrpc: '2.0',
          id: payload.id,
          error
        }
      })
    } else if (!deferredReply) {
      const rpcResult = {
        jsonrpc: '2.0',
        id: payload.id,
        result
      }

      VERBOSE > 0 && console.log('Replying to request with', rpcResult)

      sendReply(message, {
        data: rpcResult
      })
    }
  })
})

addMessageHandler({ type: 'userInterventionNotification' }, (message) => {
  isStorageLoaded().then(() => {
    const notificationId = `ambireNotification${Math.random()}`
    USER_ACTION_NOTIFICATIONS[notificationId] = true
    saveUserActionNotificationsInStorage()

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
          saveUserActionNotificationsInStorage()
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

const notifyEventChange = (type, data) => {
  // eslint-disable-next-line
  for (const tabId in TAB_INJECTIONS) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    const callback = (tab) => {
      console.log('on change has permission', PERMISSIONS[new URL(tab.url).host])
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
          console.log('Error getting tab', e)
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
        savePermissionsInStorage()
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
        updateExtensionIcon(
          message.fromTabId,
          TAB_INJECTIONS,
          PERMISSIONS,
          PENDING_PERMISSIONS_CALLBACKS
        )

        // Might want to pile up msgs with debounce in future
        openAuthPopup(host, [message])
      })
    }
  }
}
