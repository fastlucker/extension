/* eslint-disable @typescript-eslint/no-use-before-define */
// The most important part of the extension
// background workers are killed and respawned (chrome MV3) when contentScript are calling them. Firefox does not support MV3 yet but is working on it. Fortunately MV3 > MV2 is easier to migrate/support than MV2 > MV3

import { getDefaultProvider, BigNumber, ethers } from 'ethers'

import {
  setupAmbexMessenger,
  sendReply,
  addMessageHandler,
  sendMessage,
  sendAck,
  processBackgroundQueue
} from './ambexMessanger'
import { IS_FIREFOX, VERBOSE } from '../constants/env'
import { browserAPI } from '../constants/browserAPI'
import { PAGE_CONTEXT, CONTENT_SCRIPT, BACKGROUND } from '../constants/paths'
import { USER_INTERVENTION_METHODS } from '../constants/userInterventionMethods'
import { updateExtensionIcon } from '../functions/updateExtensionIcon'
import {
  TAB_INJECTIONS,
  PERMISSIONS,
  isStorageLoaded,
  saveTabInjectionsInStorage,
  savePermissionsInStorage,
  getStore
} from '../functions/storage'
import { PERMISSION_WINDOWS, deferCreateWindow } from '../functions/deferCreateWindow'

setupAmbexMessenger(BACKGROUND, browserAPI)

// TODO: find a way to store the state and exec callbacks?
const PENDING_CALLBACKS = {}
const PENDING_WEB3_RESPONSE_CALLBACKS = {}

// Initial loading call
isStorageLoaded()
  .then(() => {
    processBackgroundQueue()
  })
  .catch((e) => {
    console.error('storageLoading', e)
  })

// Useful for debug purposes, display a notification whenever background worker is reloaded
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

const broadcastExtensionDataOnChange = () => {
  isStorageLoaded().then(() => {
    browserAPI.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, { newValue }] of Object.entries(changes)) {
          if (key === 'SELECTED_ACCOUNT') {
            broadcastExtensionDataChange('ambireWalletAccountChanged', { account: newValue })
          }
          if (key === 'NETWORK') {
            broadcastExtensionDataChange('ambireWalletChainChanged', { chainId: newValue.chainId })
          }
        }
      }
    })
  })
}
broadcastExtensionDataOnChange()

// MESSAGE HANDLERS START

// When CONTENT_SCRIPT is injected, prepare injection of PAGE_CONTEXT
addMessageHandler({ type: 'contentScriptInjected' }, (message) => {
  sendReply(message, {
    data: { ack: true }
  })
})

// Save properly injected tabs
addMessageHandler({ type: 'pageContextInjected' }, (message) => {
  TAB_INJECTIONS[message.fromTabId] = true
  saveTabInjectionsInStorage()
  updateExtensionIcon(message.fromTabId, TAB_INJECTIONS, PERMISSIONS, PENDING_CALLBACKS)
})

// User click reply from request permission popup
addMessageHandler({ type: 'grantPermission' }, (message) => {
  if (PENDING_CALLBACKS[message.data.targetHost]) {
    PENDING_CALLBACKS[message.data.targetHost].callbacks.forEach((c) => {
      c(message.data.permitted)
    })
    delete PENDING_CALLBACKS[message.data.targetHost]
  }
  PERMISSIONS[message.data.targetHost] = message.data.permitted
  isStorageLoaded().then(() => {
    savePermissionsInStorage()
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in TAB_INJECTIONS) {
      updateExtensionIcon(i, TAB_INJECTIONS, PERMISSIONS, PENDING_CALLBACKS)
    }
  })
  sendReply(message, {
    data: 'done'
  })
})

// User confirms or rejects web3Call from the extension or an extension popup
addMessageHandler({ type: 'web3CallResponse' }, (msg) => {
  const message = msg.data.originalMessage
  const host = message.host
  const method = message.data ? message.data.method : null
  if (PENDING_WEB3_RESPONSE_CALLBACKS[`${host}-${method}`]) {
    PENDING_WEB3_RESPONSE_CALLBACKS[`${host}-${method}`].callbacks.forEach((c) => {
      c(msg.data)
    })
    delete PENDING_WEB3_RESPONSE_CALLBACKS[`${host}-${method}`]
  }
  sendReply(msg, {
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
      updateExtensionIcon(i, TAB_INJECTIONS, PERMISSIONS, PENDING_CALLBACKS)
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
  requestPermission(message, async (granted) => {
    const payload = message.data
    const method = payload.method

    if (!granted) {
      sendReply(message, {
        data: {
          jsonrpc: '2.0',
          id: payload.id,
          error: 'Permissions denied!'
        }
      })
      return
    }
    VERBOSE > 0 && console.log('ambirePageContext: web3CallRequest', message)
    const { NETWORK, SELECTED_ACCOUNT } = await getStore(['NETWORK', 'SELECTED_ACCOUNT'])
    if (!NETWORK || !SELECTED_ACCOUNT) return

    const provider = getDefaultProvider(NETWORK.rpc)
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
    } else if (USER_INTERVENTION_METHODS[method]) {
      deferredReply = true
      sendUserInterventionMessage(message, async (res) => {
        sendReply(res.originalMessage, {
          data: res.rpcResult
        })
      })
    } else {
      error = `Method not supported by extension hook: ${method}`
    }

    if (error) {
      console.error('Throwing error with: ', message)
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

      VERBOSE > 0 && console.log('Replying to request with: ', rpcResult)

      sendReply(message, {
        data: rpcResult
      })
    }
  })
})

// MESSAGE HANDLERS END

const openExtensionInPopup = async (host, queue, route) => {
  // For some reason, chrome defined at the top, at this moment of code execution does not return any windows information but browser (which is supposed to alias chrome) has
  // fixed with browserAPI = browser || chrome instead of the opposite
  // If there is a popup window open for this host in our cache
  if (PERMISSION_WINDOWS[host] > 0) {
    // Check if the window is still there
    let window = false
    try {
      window = await browserAPI.windows.get(PERMISSION_WINDOWS[host])
    } catch (error) {
      window = false
    }
    if (!window) {
      delete PERMISSION_WINDOWS[host]
    } else {
      // making sure the popup comes back on top
      browserAPI.windows.update(window.id, {
        focused: true,
        drawAttention: true
      })
    }
  }

  if (!PERMISSION_WINDOWS[host]) {
    PERMISSION_WINDOWS[host] = -1
    deferCreateWindow(host, queue, route)
  }
}

function isInjectableTab(tab) {
  return tab && tab.url && tab.url.startsWith('http')
}

const broadcastExtensionDataChange = (type, data) => {
  // eslint-disable-next-line
  for (const tabId in TAB_INJECTIONS) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    const callback = (tab) => {
      if (isInjectableTab(tab) && PERMISSIONS[new URL(tab.url).host]) {
        VERBOSE > 0 && console.log('BROADCASTING EXTENSION DATA CHANGE TO:', tab.url)
        sendMessage(
          {
            toTabId: tab.id,
            to: PAGE_CONTEXT,
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
}

const sendUserInterventionMessage = async (message, callback) => {
  console.log('Send user intervention message: ', message)
  const payload = message.data
  const method = payload.method
  const host = message.host
  PENDING_WEB3_RESPONSE_CALLBACKS[`${host}-${method}`] = {
    callbacks: []
  }
  PENDING_WEB3_RESPONSE_CALLBACKS[`${host}-${method}`].callbacks.push((res) => {
    callback(res)
  })
  openExtensionInPopup(message.host, [message], method)
}

// Returns wether a message is allow to transact or if host is unknown, show permission popup
const requestPermission = async (message, callback) => {
  console.log('Request permission for: ', message)
  const host = message.host

  if (PERMISSIONS[host] === true) {
    if (VERBOSE) console.log(`Host whitelisted ${host}`)
    callback(true)
  } else if (PERMISSIONS[host] === false) {
    if (VERBOSE) console.log(`Host blacklisted ${host}`)
    callback(false)
  } else {
    let diff
    if (PENDING_CALLBACKS[host]) {
      diff = new Date().getTime() - PENDING_CALLBACKS[host].requestTimestamp
    }
    if (PENDING_CALLBACKS[host] && diff < 10 * 1000) {
      if (VERBOSE) console.log(`already callback pending for ${host} ${diff / 1000} secs ago...`)
      PENDING_CALLBACKS[host].callbacks.push((permitted) => {
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

        PENDING_CALLBACKS[host] = {
          requestTimestamp: new Date().getTime(),
          callbacks: []
        }

        PENDING_CALLBACKS[host].callbacks.push((permitted) => {
          PERMISSIONS[host] = permitted
          browserAPI.storage.sync.set({ permittedHosts: PERMISSIONS }, () => {
            if (VERBOSE) console.log('permissions saved')
          })
          callback(permitted)
        })
        updateExtensionIcon(message.fromTabId, TAB_INJECTIONS, PERMISSIONS, PENDING_CALLBACKS)

        // Might want to pile up msgs with debounce in future
        openExtensionInPopup(host, [message], 'permission-request')
      })
    }
  }
}
