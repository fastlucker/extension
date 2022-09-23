// this is the messaging lib, used by all the relayers*(see below). I decided to put whatever is related to messaging in one file for code useability and avoid duplicates / 5 files, using the same kind of pattern of sub process forks to determine who is currently the runner

// There are 3 possible actors for the communication, and a message has to follow this path (from one end to the other)
// Used to know for the current relayer to who to forward
import { IS_FIREFOX, VERBOSE } from '../constants/env.js'
import {
  PAGE_CONTEXT,
  CONTENT_SCRIPT,
  BACKGROUND,
  PATHS,
  RELAYER_VERBOSE_TAG
} from '../constants/paths.js'

// Explicitly tell the BACKGROUND worker which domains are ambire wallet domains when sending a message. In the forwarding middleware ( ambire -> dapp always OK, dapp -> ambire, only if permitted)
const AMBIRE_DOMAINS = []

// The name of the current process handling the msg (itself). can be PAGE_CONTEXT (dapp page), CONTENT_SCRIPT (dappPage with more permissions) and BACKGROUND. Sometimes "I, me" is mentioned, it refers to RELAYER (the relayer is talking)
let RELAYER

// callbacks for listeners from addMessageHandler
const HANDLERS = []

// to be part of the JSON RPC generated ids when sendingMessage
let MSGCOUNT = 0

// Middleware func for BACKGROUND worker
let PERMISSION_MIDDLEWARE

// window listener handler
let WINDOWLISTENER

// for BACKGROUND only, messages coming in before BACKGROUND worker is fully initialized are stored in this queue to be processed after initialization
let INIT_MSG_QUEUE = []

// for BACKGROUND only, bool
let BACKGROUND_INITIALIZED

// eslint-disable-next-line
//haxx eslint react ambire wallet
let chromeObject
if (typeof chrome !== 'undefined') {
  // eslint-disable-next-line
  chromeObject = chrome
}

// Only necessary from BACKGROUND
let BROWSER_API

/**
 * first function to be called from "processes" using the messaging protocol
 * @param relayer == whoami
 */
const setupAmbexMessenger = (relayer, browserAPI) => {
  RELAYER = relayer
  BROWSER_API = browserAPI
  WINDOWLISTENER = (windowMessage) => handleMessage(windowMessage.data)

  if (RELAYER === BACKGROUND) {
    // listener for CONTENT_SCRIPT sent messages
    chromeObject.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(`${RELAYER} JUST GOT A REQUEST`, request, sender)

      // if BACKGROUND worker not initialized, put received message in queue, unless it's a keepalive request reply from ambire wallet
      if (
        !BACKGROUND_INITIALIZED &&
        !(request.isReply && request.to === BACKGROUND && request.type === 'keepalive_reply')
      ) {
        if (VERBOSE > 1)
          console.log(
            `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] request added to init queue`,
            request
          )
        INIT_MSG_QUEUE.push({
          request,
          sender
        })
      } else {
        // process incoming message
        handleMessage(request, sender)
      }
    })
    // Higher API levels scripts, injected in each end page
  } else if (RELAYER === CONTENT_SCRIPT) {
    // listening to messages coming from BACKGROUND worker

    chromeObject.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // Security check + avoid double routing, disallow direct handling, because when CS is broadcasting, both BACKGROUND and other CS-like receive it
      // TODO firefox
      if (
        sender.url === `chrome-extension://${sender.id}/background.js` ||
        // initially, it seems BACKGROUND sends msg without origin?!
        (!sender.url && sender.origin === 'null')
      ) {
        handleMessage(request)
        return
      }

      if (sender.url) {
        if (RELAYER === CONTENT_SCRIPT) {
          handleMessage(request)
        }
      }
    })

    if (VERBOSE > 2)
      console.log(`${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] Add EVENT LISTENER`)
    // also listening to messages coming from it's own page (PAGE_CONTEXT)
    window.addEventListener('message', WINDOWLISTENER)
  } else if (RELAYER === PAGE_CONTEXT) {
    // listening to messages coming from CONTENT_SCRIPTs
    if (VERBOSE > 2)
      console.log(`${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] Add EVENT LISTENER`)
    window.addEventListener('message', WINDOWLISTENER)
  }
}

const isCorrectForwardingPath = (relayer, source, destination, forwarders = []) => {
  if (PATHS.indexOf(source) === -1) {
    console.log('PathCheck: Unknown source', source)
    return false
  }

  if (PATHS.indexOf(destination) === -1) {
    console.log('PathCheck: Unknown destination', destination)
    return false
  }

  if (PATHS.indexOf(relayer) === -1) {
    console.log('PathCheck: Unknown relayer', relayer)
    return false
  }

  const relayerIndex = PATHS.indexOf(relayer)
  const destinationIndex = PATHS.indexOf(destination)
  const start = (!!forwarders.length && forwarders.slice(-1)[0]) || source
  const startIndex = PATHS.indexOf(start)

  const direction = destinationIndex - startIndex > 0 ? 1 : -1

  if (direction === 1) {
    if (relayerIndex < startIndex || relayerIndex > destinationIndex) {
      return false
    }
  } else if (relayerIndex < destinationIndex || relayerIndex > startIndex) {
    return false
  }
  return true
}

const handleMessage = function (message, sender = null) {
  // ignoring react posting messages
  if (message && message.source && message.source.startsWith('react')) {
    return
  }

  if (VERBOSE > 1)
    console.log(
      `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] Handling message`,
      message
    )

  if (IS_FIREFOX) {
    if (!sender.origin) sender.origin = sender.url
  }

  // if I am the final message destination
  if (message.to === RELAYER) {
    // get appropriate callback to handle message
    const handlerIndex = HANDLERS.findIndex(
      (h) =>
        // REPLIES
        (h.requestFilter.isReply && message.isReply && h.requestFilter.id === message.id) ||
        // CALLS
        (!h.requestFilter.isReply &&
          h.requestFilter.type === message.type &&
          (!h.requestFilter.from || h.requestFilter.from === message.from) &&
          (!h.requestFilter.to || h.requestFilter.to === message.to))
    )

    // setting tabId origin (normal pages or extension pages/popups)
    if (RELAYER === BACKGROUND) {
      if (IS_FIREFOX && sender.tab && sender.tab.url === 'about:addons') {
        message.fromTabId = 'extension'
      } else if (sender.tab) {
        message.fromTabId = sender.tab.id
      } else if (
        sender.origin.startsWith('chrome-extension') ||
        sender.origin.startsWith('moz-extension')
      ) {
        message.fromTabId = 'extension'
      }

      if (message.type === 'web3Call') {
        if (!isCorrectForwardingPath(RELAYER, message.from, message.to, message.forwarders)) {
          if (VERBOSE > 1)
            console.log(
              `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] incorrect path. dropping...`,
              message
            )
          return
        }
        // check if I have permission to forward @param message from this @param sender
        checkForwardPermission(message, sender, (granted) => {
          // If permission granted
          console.log('checkForwardPermission', granted, message)
          if (granted) {
            HANDLERS[handlerIndex].callback(message, message.error)
          }
        })
        return
      }
    }

    if (handlerIndex !== -1) {
      if (VERBOSE > 2)
        console.debug(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] Handler #${handlerIndex} found`
        )
      HANDLERS[handlerIndex].callback(message, message.error)
    } else if (message.isReply) {
      if (VERBOSE > 2)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] nothing to handle the reply. Probably a extension broadcast dupe and already process`,
          message
        )
    } else if (VERBOSE > 2)
      console.log(
        `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] nothing to handle the message`,
        message
      )
  } else if (message.to) {
    // if message not for me, but has a destination, act as a forwarder

    if (!isCorrectForwardingPath(RELAYER, message.from, message.to, message.forwarders)) {
      if (VERBOSE > 1)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] incorrect path. dropping...`,
          message
        )
      return
    }

    const messageToForward = JSON.parse(JSON.stringify(message))
    // Background is the gate letting pass messages or not
    if (RELAYER === BACKGROUND) {
      if (sender.tab) {
        messageToForward.fromTabId = sender.tab.id
      } else if (
        sender.origin.startsWith('chrome-extension') ||
        sender.origin.startsWith('moz-extension')
      ) {
        messageToForward.fromTabId = 'extension'
      }
    }
    // init previous forwarders if not existing (should I name it previousForwarders instead of forwarders?)
    if (!messageToForward.forwarders) {
      messageToForward.forwarders = []
    }

    // If I already forwarded the message
    if (messageToForward.forwarders.indexOf(RELAYER) !== -1) {
      if (VERBOSE > 1)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] : Already forwarded message. Ignoring`,
          messageToForward
        )
      // Ignore self message
    } else if (RELAYER === message.from) {
      if (VERBOSE > 1)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] : Ignoring self message`,
          messageToForward
        )
    } else if (messageToForward.from !== RELAYER) {
      // If I did not forward this message and this message is NOT from me + edge case for extension pages catching it...
      if (VERBOSE > 0)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] : Forwarding message`,
          messageToForward
        )
      messageToForward.forwarders.push(RELAYER)
      sendMessageInternal(messageToForward).catch((err) => {
        sendReply(messageToForward, { error: err.message })
      })
    } else if (VERBOSE > 1)
      console.warn(
        `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] : Unexpected case:`,
        messageToForward
      )
  } else if (VERBOSE > 1)
    console.log(
      `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] : ambexMessenger ignoring message`,
      message
    )
}

/**
 * Check if message has permission to pass through / display permission popup if not requested yet + ambire origin security check
 * @param message
 * @param sender
 * @param callback
 */
const checkForwardPermission = (message, sender, callback) => {
  if (RELAYER === BACKGROUND) {
    if (message.from === CONTENT_SCRIPT && message.to === CONTENT_SCRIPT) {
      // from/to CONTENT_SCRIPT/extension page, always forward
      callback(true, message)
    } else {
      // from dapp PAGE_CONTEXT, go through the middleware that checks if domain is permitted
      PERMISSION_MIDDLEWARE(message, sender, callback)
    }
  } else {
    // if I am not BACKGROUND, always relay
    callback(true, message)
  }
}

// called in BACKGROUND worker
const setPermissionMiddleware = (callback) => {
  PERMISSION_MIDDLEWARE = callback
}

// called by BACKGROUND processing the pending queue potentially filled before BACKGROUND worker initialisation, then clear it
const processBackgroundQueue = () => {
  console.log('processing init pending messages queue', INIT_MSG_QUEUE)
  BACKGROUND_INITIALIZED = true
  for (const msg of INIT_MSG_QUEUE) {
    handleMessage(msg.request, msg.sender)
  }
  INIT_MSG_QUEUE = []
}

// TODO where to refactor for no dupes?
const getAmbireTabIds = async () => {
  return new Promise((resolve) => {
    BROWSER_API.tabs.query({}, (tabs) => {
      resolve(
        tabs.filter((t) => AMBIRE_DOMAINS.indexOf(new URL(t.url).host) !== -1).map((t) => t.id)
      )
    })
  })
}

// Updating and sending message, not exposed
const sendMessageInternal = async (message) => {
  message.sender = RELAYER
  if (VERBOSE > 1)
    console.log(
      `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] try sendMessageInternal`,
      message
    )
  // If I am BACKGROUND worker
  if (RELAYER === BACKGROUND) {
    if (!message.toTabId) {
      // if no toTabId specified, BACKGROUND does not know where to sent it
      if (VERBOSE)
        console.error(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] toTabId must be specified for worker communication`,
          message
        )
      return false
    }

    console.log('SENDING TO TABID', message.toTabId)
    // extension pages have no tabId but 'extension' is specified in the msg
    if (message.toTabId === 'extension') {
      if (VERBOSE)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sending message as BG -> EXT(${message.to}):`,
          message
        )
      chromeObject.runtime.sendMessage(message)
    } else {
      // for specific CONTENT_SCRIPT tabs
      // TODO if fromTabId url is extension > replace fromTabId with 'extension' for replies ?
      //  But what about isolated extension pages?
      if (VERBOSE)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sending message as BG -> ${message.to}:`,
          message
        )
      chromeObject.runtime.sendMessage(message)
      chromeObject.tabs.sendMessage(message.toTabId, message)
    }
  } else if (RELAYER === CONTENT_SCRIPT) {
    // check in which direction to sent
    const pathIndex = PATHS.indexOf(RELAYER)
    const forwardPath = PATHS.slice(pathIndex + 1, PATHS.length)

    if (forwardPath.includes(message.to)) {
      // if next relayers are BG, ACS, APC
      if (VERBOSE)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sending message as CS -> BG:`,
          message
        )
      chromeObject.runtime.sendMessage(message)
    } else if (message.to === CONTENT_SCRIPT) {
      // other extension pages
      if (VERBOSE)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sending message as CS -> CS:`,
          message
        )
      chromeObject.runtime.sendMessage(message)
    } else {
      // passing down to PAGE_CONTEXT
      if (VERBOSE)
        console.log(
          `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sending message CS -> PC:`,
          message
        )
      window.postMessage(message)
    }
  } else if (RELAYER === PAGE_CONTEXT) {
    if (VERBOSE) {
      console.log(
        `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sending message PC -> CS:`,
        message
      )
    }

    // passing up to CONTENT_SCRIPTs
    window.postMessage(message)
  }
}

/**
 * used by processes to send messages
 * @param message == {to, type, [data]}
 * @param callback optional reply callback
 * @param options for now only replyTimeout
 */
// TODO use .then instead of callback
const sendMessage = (message, options = {}) => {
  options = {
    replyTimeout: 5000,
    ignoreReply: false,
    ...options
  }

  // incrementing global var of sender to compose msg id
  MSGCOUNT++

  message.id = `${RELAYER}_${MSGCOUNT}_${Math.random()}`
  message.from = RELAYER

  const handlerFilter = {
    id: message.id,
    isReply: true
  }

  let resolved = false

  const timeoutPromise = !options.ignoreReply
    ? new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!resolved) {
            removeMessageHandler(handlerFilter)
            reject(new Error(`Timeout: no reply for message${JSON.stringify(message)}`))
            if (VERBOSE > 2)
              console.log(
                `${
                  RELAYER_VERBOSE_TAG[RELAYER]
                } ambexMessenger[${RELAYER}] timeout : ${JSON.stringify(message)}`
              )
          }
        }, options.replyTimeout)
      })
    : null

  const resultPromise = new Promise((resolve, reject) => {
    // add a handler for the reply if there is a callback specified
    if (!options.ignoreReply) {
      addMessageHandler(handlerFilter, (reply, error) => {
        resolved = true
        if (VERBOSE > 2)
          console.log(
            `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] clearing timeout listener`,
            message
          )
        removeMessageHandler(handlerFilter)
        if (error) {
          return reject(new Error(error))
        }
        resolve(reply)
      })
    }

    sendMessageInternal(message)
      .then(() => {
        if (options.ignoreReply) {
          resolve(true)
        }
      })
      .catch((err) => {
        resolved = true
        console.log('sendMsgInternal err', err)
        if (!options.ignoreReply) {
          removeMessageHandler(handlerFilter)
        }
        reject(err)
      })
  })

  if (VERBOSE)
    console.log(`${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sendMessage}`, message)

  if (options.ignoreReply) return resultPromise
  return Promise.race([timeoutPromise, resultPromise])
}

/**
 * reply to request, meant to be used by sendMessage processes callbacks
 * @param fromMessage the original request message
 * @param message message to reply with (in most of the cases only data should be passed {[data]}). from / to will be specified here
 */
const sendReply = (fromMessage, message) => {
  if (!fromMessage) {
    return false
  }

  message.id = fromMessage.id
  message.from = RELAYER
  message.to = fromMessage.from
  message.toTabId = fromMessage.fromTabId
  message.isReply = true
  // for debug/verbose purposes
  message.originalMessage = fromMessage

  sendMessageInternal(message).catch((err) => {
    if (VERBOSE)
      console.error(
        `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sendReply failed`,
        err
      )
  })
}

// sendReply shortcut, to be used by dApps
const sendAck = (fromMessage) => {
  sendMessageInternal({
    from: RELAYER,
    to: fromMessage.from,
    toTabId: fromMessage.fromTabId,
    isReply: true,
    id: fromMessage.id,
    data: { ack: true }
  }).catch((err) => {
    if (VERBOSE)
      console.error(
        `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] sendAck failed`,
        err
      )
  })
}

const removeMessageHandler = (filter) => {
  const handlerIndex = HANDLERS.findIndex(
    (h) =>
      // REPLIES
      ((h.requestFilter.isReply && filter.isReply && h.requestFilter.id === filter.id) ||
        // CALLS
        (!h.requestFilter.isReply &&
          h.requestFilter.type === filter.type &&
          (!h.requestFilter.from || h.requestFilter.from === filter.from) &&
          (!h.requestFilter.to || h.requestFilter.to === filter.to))) &&
      (!filter.context || filter.context === h.requestFilter.context)
  )

  if (VERBOSE > 2)
    console.debug(
      `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] remove handler of`,
      JSON.parse(JSON.stringify(HANDLERS)),
      filter
    )

  if (handlerIndex !== -1) {
    HANDLERS.splice(handlerIndex, 1)
    if (VERBOSE > 2)
      console.debug(
        `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] handler removed. ${HANDLERS.length} left`,
        filter
      )
  } else if (VERBOSE > 2)
    console.debug(
      `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] handler NOT FOUND. ${HANDLERS.length} left`,
      filter
    )
}

// add handlers (can be filtered by type/dst/sender/reply)
const addMessageHandler = (filter, callback) => {
  HANDLERS.push({
    requestFilter: { ...filter, isFilter: true },
    callback
  })
  if (VERBOSE > 2)
    console.debug(
      `${RELAYER_VERBOSE_TAG[RELAYER]} ambexMessenger[${RELAYER}] handler added`,
      JSON.parse(JSON.stringify(HANDLERS))
    )
}

// rpc error helper
const makeRPCError = (requestPayload, error, errorCode = -1) => {
  return {
    id: requestPayload.id,
    version: requestPayload.version,
    error: { code: errorCode, message: error },
    jsonrpc: requestPayload.jsonrpc
  }
}

export {
  addMessageHandler,
  setupAmbexMessenger,
  setPermissionMiddleware,
  processBackgroundQueue,
  sendMessage,
  sendAck,
  sendReply,
  removeMessageHandler,
  makeRPCError
}
