// @ts-nocheck

// Script injected in the page Shares the same environment as the web page
// Here is where the web3 injection happens

import log from 'loglevel'

import {
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV,
  BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
} from '@env'

import { BACKGROUND, PAGE_CONTEXT } from '../constants/paths'
import { addMessageHandler, sendMessage, setupAmbexMessenger } from './ambexMessanger'

log.setDefaultLevel(
  process.env.APP_ENV === 'production'
    ? BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_PROD
    : BROWSER_EXTENSION_DEFAULT_LOG_LEVEL_DEV
)

const Web3 = require('web3')

// Unify error formatting
const formatErr = (err) => {
  if (typeof err === 'string') {
    return Error(err)
  }
  if (err instanceof Error) {
    return err
  }
  if (err.code) {
    return err
  }
  if (err.message) {
    return err.message
  }

  return err
}

// Wrapped promise for ethereum.request
const ethRequest = (requestPayload) =>
  new Promise((resolve, reject) => {
    const replyTimeout = 6 * 60 * 1000 // 6 minutes

    sendMessage(
      {
        to: BACKGROUND,
        type: 'web3Call',
        data: requestPayload
      },
      {
        replyTimeout
      }
    )
      .then((reply) => {
        const data = reply.data
        if (data) {
          if (data.error) {
            reject(formatErr(data.error))
          } else {
            const result = reply.data ? reply.data.result : null
            if (reply.error) {
              return reject(formatErr(data.error))
            }
            return resolve(result)
          }
        } else {
          return reject(formatErr('empty reply'))
        }
      })
      .catch((err) => {
        log.error('ethRequest: ', err)
        return reject(formatErr(err))
      })
  })

// Informs dapp that accounts were changed
function accountsChanged(account) {
  log.debug('accountsChanged', account)
  window.ethereum.emit('accountsChanged', account ? [account] : [])
  window.web3.currentProvider.emit('accountsChanged', account ? [account] : [])
}

// Informs dapp that chain was changed
function chainChanged(chainId) {
  log.debug('chainChanged', chainId)
  window.ethereum.emit('chainChanged', chainId)
  window.web3.currentProvider.emit('chainChanged', chainId)
  window.ethereum.emit('networkChanged', chainId)
  window.web3.currentProvider.emit('networkChanged', chainId)
}

// Our web3 provider
function ExtensionProvider() {
  this.eventHandlers = {
    chainChanged: [],
    networkChanged: [],
    accountsChanged: []
  }

  this.on = function (evt, handler) {
    log.debug(`Setting event handler for ${evt}`)
    if (Object.keys(this.eventHandlers).indexOf(evt) !== -1) {
      this.eventHandlers[evt].push(handler)
    }
  }

  this.removeListener = function (evt, handler) {
    if (Object.keys(this.eventHandlers).indexOf(evt) !== -1) {
      const index = this.eventHandlers[evt].findIndex((a) => a === handler)
      if (index !== -1) {
        delete this.eventHandlers[evt][index]
      }
    }
  }

  this.removeAllListeners = function (evt) {
    if (evt && evt.length) {
      evt.forEach((e) => {
        if (this.eventHandlers[e]) {
          this.eventHandlers[e] = []
        }
      })
    } else if (evt) {
      if (this.eventHandlers[evt]) {
        this.eventHandlers[evt] = []
      }
    } else {
      this.eventHandlers = {
        chainChanged: [],
        networkChanged: [],
        accountsChanged: []
      }
    }
  }

  this.emit = function (evt, data) {
    if (this.eventHandlers[evt] && this.eventHandlers[evt].length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const callback of this.eventHandlers[evt]) {
        if (typeof callback === 'function') {
          callback(data)
        } else {
          log.debug('emit callback is not a function', callback)
        }
      }
    }
  }

  this.send = async function (payload, paramsOrCallback) {
    log.debug('Payload to send to background', payload)
    log.debug('paramsOrCallback:', paramsOrCallback)

    const genId = `sendId_${Math.random()}`

    let formattedPayload = {
      jsonrpc: '2.0',
      id: genId
    }
    if (typeof payload === 'string') {
      formattedPayload.method = payload
    } else {
      formattedPayload = {
        ...formattedPayload,
        ...payload
      }
    }

    if (Array.isArray(paramsOrCallback)) {
      formattedPayload.params = paramsOrCallback
    }

    log.debug('Formatted payload', formattedPayload)

    let hasErr
    let requestErr
    const result = await ethRequest(formattedPayload).catch((err) => {
      log.debug('send ethRequest err', err)
      hasErr = true // might err be undefined?
      requestErr = err
    })
    if (hasErr) {
      if (requestErr instanceof Error) {
        throw requestErr
      } else if (typeof requestErr === 'object') {
        throw requestErr
      } else {
        throw Error(`${requestErr}`)
      }
    }

    return result
  }

  this.sendAsync = this.send

  this.supportsSubscriptions = () => false

  this.disconnect = () => true

  this.isConnected = () => true

  this.enable = async function () {
    const payload = {
      jsonrpc: '2.0',
      id: `reqId_${Math.random()}`,
      method: 'eth_requestAccounts'
    }
    let hasErr
    let requestErr
    const result = await ethRequest(payload).catch((err) => {
      log.debug('send ethRequest err', err)
      hasErr = true // might err be undefined?
      requestErr = err
    })
    if (hasErr) {
      if (requestErr instanceof Error) {
        throw requestErr
      } else if (typeof requestErr === 'object') {
        throw requestErr
      } else {
        throw Error(`${requestErr}`)
      }
    }

    return result
  }

  this.request = async function (arg, arg2) {
    const requestMethod = arg.method
    const genId = `reqId_${Math.random()}`
    const payload = {
      jsonrpc: '2.0',
      id: genId,
      method: requestMethod
    }
    if (arg.iteration) {
      payload.iteration = arg.iteration
    }
    if (arg.params) {
      payload.params = arg.params
    }

    log.trace(`REQ ${genId} ${payload.method}`, payload)

    let hasErr
    let requestErr
    const result = await ethRequest(payload).catch((err) => {
      log.debug('ethRequest err', err)
      hasErr = true // might err be undefined?
      requestErr = err
      // throw err
    })
    if (hasErr) {
      if (requestErr instanceof Error) {
        throw requestErr
      } else if (typeof requestErr === 'object') {
        throw requestErr
      } else {
        throw Error(`${requestErr}`)
      }
    }

    log.trace(`RES ${genId} ${payload.method}`, {
      payload,
      result
    })
    return result
  }

  // Needed for dapps
  this.isMetaMask = true

  // Needed for ourselves, to check of extension web3 is already injected
  this.isAmbire = true
}

const ethereumProvider = new ExtensionProvider()
const ethereumProxyProvider = new Proxy(ethereumProvider, {
  deleteProperty: () => true
})

;(() => {
  // To be removed from DOM after execution
  const element = document.querySelector('#page-context')

  let overridden = false

  // Existing injection (MM or else)?
  const existing = (window.ethereum && true) || false

  if (existing) {
    if (window.ethereum.isAmbire) {
      // don't override
    } else {
      overridden = true
    }
  }

  // If never injected, setup listeners and handlers
  if (!window.ambexMessengerSetup) {
    setupAmbexMessenger(PAGE_CONTEXT)

    // Informs BACKGROUND that PAGE_CONTEXT is injected
    sendMessage(
      {
        type: 'pageContextInjected',
        to: BACKGROUND,
        data: { args: element.dataset.args, overridden, existing }
      },
      { ignoreReply: true }
    )

    addMessageHandler({ type: 'ambireWalletConnected' }, (message) => {
      log.debug('pageContext: emitting MM event connect', message.data)
      accountsChanged(message.data.account)
      chainChanged(message.data.chainId)
    })

    addMessageHandler({ type: 'ambireWalletDisconnected' }, () => {
      log.debug('pageContext: emitting event disconnect')
      window.ethereum.emit('disconnect')
      window.web3.currentProvider.emit('disconnect')
      accountsChanged(null)
      chainChanged(null)
    })

    addMessageHandler({ type: 'ambireWalletChainChanged' }, (message) => {
      log.debug('pageContext: emitting event chainChanged', message)
      chainChanged(message.data.chainId)
    })

    addMessageHandler({ type: 'ambireWalletAccountChanged' }, (message) => {
      log.debug('pageContext: emitting event accountChanged', message)
      accountsChanged(message.data.account)
    })

    window.ambexMessengerSetup = true
  }

  // Avoids re-injection.
  // One injection happens at the very beginning of the page load,
  // and one when page loading is completed (to override web3 if !web3.isAmbire)
  if (!existing || overridden) {
    window.ethereum = ethereumProxyProvider
    window.web3 = new Web3(ethereumProxyProvider)
  }

  // Cleaning DOM
  // Removes the current script (not needed after web3 injection anymore)
  try {
    element.parentNode.removeChild(document.querySelector('#page-context'))
  } catch (error) {
    // silent fail
  }
})()
