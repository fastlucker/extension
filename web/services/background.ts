// @ts-nocheck

/* eslint-disable @typescript-eslint/no-use-before-define */
// The backbone of the extension
// Background workers are killed and respawned (chrome MV3) when contentScript are calling them.
// Firefox does not support MV3 yet but is working on it.

import { initRpcProviders } from 'ambire-common/src/services/provider'
import { BigNumber, ethers, getDefaultProvider } from 'ethers'
import log from 'loglevel'

import {
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV,
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
} from '@env'
import { StorageController } from '@modules/common/contexts/storageContext/storageController'
import { rpcProviders } from '@modules/common/services/providers'
import VaultController from '@modules/vault/services/VaultController'
import { browserAPI } from '@web/constants/browserAPI'
import { errorCodes } from '@web/constants/errors'
import { BACKGROUND, PAGE_CONTEXT } from '@web/constants/paths'
import { USER_INTERVENTION_METHODS } from '@web/constants/userInterventionMethods'
import { deferCreateWindow, PERMISSION_WINDOWS } from '@web/functions/deferCreateWindow'
import { updateExtensionIcon } from '@web/functions/updateExtensionIcon'
import {
  addMessageHandler,
  processBackgroundQueue,
  sendAck,
  sendMessage,
  sendReply,
  setupAmbexMessenger
} from '@web/services/ambexMessanger'

log.setDefaultLevel(
  process.env.APP_ENV === 'production'
    ? BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
    : BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV
)

setupAmbexMessenger(BACKGROUND, browserAPI)
// Initialize rpc providers for all networks
initRpcProviders(rpcProviders)

// TODO: find a way to store the state and exec callbacks?
const PENDING_CALLBACKS = {}
const PENDING_WEB3_RESPONSE_CALLBACKS = {}

const storageController = new StorageController()
addMessageHandler({ type: 'storageController' }, async (message) => {
  if (storageController[message.data.method]) {
    try {
      const res = await storageController[message.data.method](message.data.props)
      sendReply(message, {
        data: res
      })
    } catch (error) {
      sendReply(message, {
        error: error.message || error
      })
    }
  } else {
    sendReply(message, {
      error: 'Storage controller not initialized'
    })
  }
})

// Initial loading call.
storageController
  .isStorageLoaded()
  .then(() => {
    processBackgroundQueue()
  })
  .catch((e) => {
    log.error('storageLoading', e)
  })

log.debug('Background service restarted!')

const broadcastExtensionDataOnChange = () => {
  storageController.isStorageLoaded().then(() => {
    browserAPI.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, { newValue }] of Object.entries(changes)) {
          if (key === 'selectedAcc') {
            broadcastExtensionDataChange('ambireWalletAccountChanged', { account: newValue })
          }
          if (key === 'network') {
            broadcastExtensionDataChange('ambireWalletChainChanged', { chainId: newValue.chainId })
          }
        }
      }
    })
  })
}
// Execute the func right away
broadcastExtensionDataOnChange()

// MESSAGE HANDLERS START HERE

// When CONTENT_SCRIPT is injected, prepare injection of PAGE_CONTEXT
addMessageHandler({ type: 'contentScriptInjected' }, (message) => {
  sendReply(message, {
    data: { ack: true }
  })
})

// Save properly injected tabs
addMessageHandler({ type: 'pageContextInjected' }, async (message) => {
  storageController.isStorageLoaded().then(() => {
    const tabInjections = storageController.getItem('TAB_INJECTIONS')
    const permissions = storageController.getItem('PERMISSIONS')

    const nextTabInjections = {
      ...tabInjections,
      [message.fromTabId]: true
    }

    storageController.setItem('TAB_INJECTIONS', nextTabInjections)

    updateExtensionIcon(
      message.fromTabId,
      nextTabInjections,
      permissions,
      PENDING_CALLBACKS,
      PENDING_WEB3_RESPONSE_CALLBACKS
    )
  })
})

// User sends back a reply from the request permission popup
addMessageHandler({ type: 'grantPermission' }, async (message) => {
  await storageController.isStorageLoaded()

  const tabInjections = storageController.getItem('TAB_INJECTIONS')
  const permissions = storageController.getItem('PERMISSIONS')

  if (PENDING_CALLBACKS[message.data.targetHost]) {
    PENDING_CALLBACKS[message.data.targetHost].callbacks.forEach((c) => {
      c(message.data.permitted)
    })
    delete PENDING_CALLBACKS[message.data.targetHost]
  }
  storageController.isStorageLoaded().then(() => {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in tabInjections) {
      updateExtensionIcon(
        i,
        tabInjections,
        permissions,
        PENDING_CALLBACKS,
        PENDING_WEB3_RESPONSE_CALLBACKS
      )
    }
  })
  sendReply(message, {
    data: 'done'
  })
})

const vaultController = new VaultController()

addMessageHandler({ type: 'vaultController' }, async (message) => {
  if (vaultController[message.data.method]) {
    try {
      const res = await vaultController[message.data.method](message.data.props)
      sendReply(message, {
        data: res
      })
    } catch (error) {
      sendReply(message, {
        error: error.message || error
      })
    }
  } else {
    sendReply(message, {
      error: 'Vault controller not initialized'
    })
  }
})

// User sends back a reply from the request permission popup
addMessageHandler({ type: 'clearPendingCallback' }, (message) => {
  const tabInjections = storageController.getItem('TAB_INJECTIONS')
  const permissions = storageController.getItem('PERMISSIONS')

  if (PENDING_CALLBACKS[message.data.targetHost]) {
    delete PENDING_CALLBACKS[message.data.targetHost]
  }
  if (PENDING_WEB3_RESPONSE_CALLBACKS[message.data.targetHost]) {
    delete PENDING_WEB3_RESPONSE_CALLBACKS[message.data.targetHost]
  }
  storageController.isStorageLoaded().then(() => {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in tabInjections) {
      updateExtensionIcon(
        i,
        tabInjections,
        permissions,
        PENDING_CALLBACKS,
        PENDING_WEB3_RESPONSE_CALLBACKS
      )
    }
  })
})

// User confirms or rejects web3Call from the extension or an extension popup
addMessageHandler({ type: 'web3CallResponse' }, (msg) => {
  const tabInjections = storageController.getItem('TAB_INJECTIONS')
  const permissions = storageController.getItem('PERMISSIONS')

  const message = msg.data.originalMessage
  const host = message.host
  if (PENDING_WEB3_RESPONSE_CALLBACKS[host]) {
    PENDING_WEB3_RESPONSE_CALLBACKS[host].callbacks.forEach((c) => {
      c(msg.data)
    })
    delete PENDING_WEB3_RESPONSE_CALLBACKS[host]
  }
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const i in tabInjections) {
    updateExtensionIcon(
      i,
      tabInjections,
      permissions,
      PENDING_CALLBACKS,
      PENDING_WEB3_RESPONSE_CALLBACKS
    )
  }
  sendReply(msg, {
    data: 'done'
  })
})

// The Ambire extension requests list of permissions
addMessageHandler({ type: 'getPermissionsList' }, (message) => {
  storageController.isStorageLoaded().then(() => {
    const permissions = storageController.getItem('PERMISSIONS')

    sendReply(message, {
      data: permissions
    })
  })
})

// The Ambire extension requests permission removal from the list of permissions
addMessageHandler({ type: 'removeFromPermissionsList' }, (message) => {
  storageController.isStorageLoaded().then(() => {
    const tabInjections = storageController.getItem('TAB_INJECTIONS')
    const permissions = storageController.getItem('PERMISSIONS')

    delete permissions[message.data.host]

    storageController.setItem('PERMISSIONS', permissions)
    sendAck(message)

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in tabInjections) {
      updateExtensionIcon(
        i,
        tabInjections,
        permissions,
        PENDING_CALLBACKS,
        PENDING_WEB3_RESPONSE_CALLBACKS
      )
    }
  })
})

const sanitize2hex = (any) => {
  log.trace(`instanceof of any is ${any instanceof BigNumber}`)
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
      if (method === 'eth_accounts' || method === 'eth_chainId' || method === 'net_version') {
        sendReply(message, {
          data: {
            jsonrpc: '2.0',
            id: payload.id,
            result: method === 'eth_accounts' ? [] : null
          }
        })
      } else {
        sendReply(message, {
          data: {
            jsonrpc: '2.0',
            id: payload.id,
            error: { message: 'Permissions denied!', code: errorCodes.provider.unauthorized }
          }
        })
      }
      return
    }
    log.info('ambirePageContext: web3CallRequest', message)
    const { network, selectedAcc } = storageController.getItems(['network', 'selectedAcc'])

    if (!network || !selectedAcc) {
      sendReply(message, {
        data: {
          jsonrpc: '2.0',
          id: payload.id,
          error: { message: 'Internal extension wallet error!', code: errorCodes.rpc.internal }
        }
      })
      return
    }

    const provider = getDefaultProvider(network.rpc)
    let deferredReply = false

    const callTx = payload.params
    let result
    let error
    if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
      result = [selectedAcc]
    } else if (method === 'eth_chainId' || method === 'net_version') {
      result = ethers.utils.hexlify(network.chainId)
    } else if (method === 'wallet_requestPermissions') {
      result = [{ parentCapability: 'eth_accounts' }]
    } else if (method === 'wallet_getPermissions') {
      result = [{ parentCapability: 'eth_accounts' }]
    } else if (method === 'eth_coinbase') {
      result = selectedAcc
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
      log.trace('Result', result, error)
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
      error = {
        message: `Ambire doesn't support this method: ${method}`,
        code: errorCodes.rpc.methodNotSupported
      }
    }

    if (error) {
      log.error('Throwing error with: ', message)
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

      log.info('Replying to request with: ', rpcResult)

      sendReply(message, {
        data: rpcResult
      })
    }
  })
})

// MESSAGE HANDLERS END HERE

const openExtensionInPopup = async (host, queue, route) => {
  // For some reason, chrome defined at the top, at the moment of code execution does not return any windows information but browser (which is supposed to alias chrome) has
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
      // Making sure the popup comes back on top
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
  const tabInjections = storageController.getItem('TAB_INJECTIONS')
  const permissions = storageController.getItem('PERMISSIONS')

  // eslint-disable-next-line
  for (const tabId in tabInjections) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    const callback = (tab) => {
      if (isInjectableTab(tab) && permissions[new URL(tab.url).host]) {
        log.debug('BROADCASTING EXTENSION DATA CHANGE TO:', tab.url)
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

    if (browserAPI.browserAction) {
      try {
        browserAPI.tabs.get(tabId * 1, callback)
      } catch (e) {
        log.debug('Error getting tab', e)
      }
    } else {
      browserAPI.tabs
        .get(tabId * 1)
        .then(callback)
        .catch((e) => {
          log.debug('Error getting tab', e)
        })
    }
  }
}

const sendUserInterventionMessage = async (message, callback) => {
  log.debug('Send user intervention message: ', message)
  const tabInjections = storageController.getItem('TAB_INJECTIONS')
  const permissions = storageController.getItem('PERMISSIONS')

  const payload = message.data
  const method = payload.method
  const host = message.host
  PENDING_WEB3_RESPONSE_CALLBACKS[host] = {
    callbacks: []
  }
  PENDING_WEB3_RESPONSE_CALLBACKS[host].callbacks.push((res) => {
    callback(res)
  })
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  updateExtensionIcon(
    message.fromTabId,
    tabInjections,
    permissions,
    PENDING_CALLBACKS,
    PENDING_WEB3_RESPONSE_CALLBACKS
  )
  openExtensionInPopup(message.host, [message], method)
}

// Returns wether a message is allow to transact or if host is unknown, show permission popup
const requestPermission = async (message, callback) => {
  log.debug('Request permission for: ', message)

  await storageController.isStorageLoaded()

  const tabInjections = storageController.getItem('TAB_INJECTIONS')
  const permissions = storageController.getItem('PERMISSIONS')
  const host = message.host
  const payload = message.data
  const method = payload.method

  if (permissions[host] === true) {
    log.debug(`Host whitelisted ${host}`)
    callback(true)
  } else if (!permissions[host] && method === 'eth_accounts') {
    callback(false)
  } else if (!PENDING_CALLBACKS[host] && method === 'eth_requestAccounts') {
    log.debug(`setting pending callback for ${host}`)

    // check if tab will receive it
    browserAPI.tabs.get(message.fromTabId, async (tab) => {
      if (!tab) {
        log.warn('No matching tab found for permission request', message)
        return
      }

      if (!PENDING_CALLBACKS[host]) {
        PENDING_CALLBACKS[host] = {
          requestTimestamp: new Date().getTime(),
          callbacks: []
        }
      }
      PENDING_CALLBACKS[host].popupOpened = true
      PENDING_CALLBACKS[host].callbacks.push((permitted) => {
        // TODO:
        // Temporary saves only the dapps with granted permission
        // Later on when a list of blacklisted dapps is implemented on the FE
        //  the denied permissions should be added to the list as well
        if (permitted) {
          permissions[host] = permitted

          storageController.setItem('PERMISSIONS', permissions)
          storageController.setItem('permittedHosts', permissions)

          log.debug('permissions saved')
        }
        callback(permitted)
      })
      updateExtensionIcon(
        message.fromTabId,
        tabInjections,
        permissions,
        PENDING_CALLBACKS,
        PENDING_WEB3_RESPONSE_CALLBACKS
      )

      // Might want to pile up msgs with debounce in future
      openExtensionInPopup(host, [message], 'permission-request')
    })
  } else {
    // Wait for other consecutive (web3) pending request before responding
    setTimeout(() => {
      if (PENDING_CALLBACKS[host]) {
        if (PENDING_CALLBACKS[host].popupOpened) {
          PENDING_CALLBACKS[host].callbacks.push((permitted) => {
            callback(permitted)
          })
        } else {
          callback(false)
        }
      } else {
        callback(false)
      }
    }, 1000)
  }
}
