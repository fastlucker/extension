import {
  CallbackFunction,
  createMessenger,
  ReplyMessage,
  SendMessage
} from '@web/extension-services/messengers/internal/createMessenger'
import { isValidReply } from '@web/extension-services/messengers/internal/isValidReply'
import { isValidSend } from '@web/extension-services/messengers/internal/isValidSend'

// Prevent the Ambire extension tab to be the last tab returned by the getActiveTabs func
let activeTab: chrome.tabs.Tab

function getActiveTabs() {
  if (!chrome.tabs) return Promise.resolve([])

  return new Promise((resolve: (v: [chrome.tabs.Tab]) => void) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
      if (!tab?.url?.startsWith('http') && activeTab) {
        resolve([activeTab])
        return
      }

      activeTab = tab

      resolve([tab])
    })
  })
}

function sendMessage<TPayload>(message: SendMessage<TPayload>, { tabId }: { tabId?: number } = {}) {
  if (!tabId) {
    chrome?.runtime?.sendMessage?.(message)
  } else {
    chrome.tabs?.sendMessage(tabId, message)
  }
}

/**
 * Creates a "tab messenger" that can be used to communicate between
 * scripts where `chrome.tabs` & `chrome.runtime` is defined.
 *
 * Compatible connections:
 * - ❌ Background <-> Inpage
 * - ✅ Background <-> Content Script
 * - ❌ Content Script <-> Inpage
 */
export const tabMessenger = createMessenger({
  available: Boolean(typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.tabs),
  name: 'tabMessenger',
  async send<TPayload, TResponse>(
    topic: string,
    payload: TPayload,
    { id }: { id?: number | string } = {}
  ) {
    return new Promise<TResponse>((resolve, reject) => {
      const listener = (
        message: ReplyMessage<TResponse>,
        _: chrome.runtime.MessageSender,
        sendResponse: (response?: unknown) => void
      ) => {
        if (!isValidReply<TResponse>({ id, message, topic })) return

        chrome.runtime.onMessage?.removeListener(listener)

        const { response: r, error } = message.payload
        if (error) reject(new Error(error.message))
        resolve(r)
        sendResponse({})
        return true
      }
      chrome.runtime.onMessage?.addListener(listener)

      getActiveTabs().then(([tab]) => {
        sendMessage({ topic: `> ${topic}`, payload, id }, { tabId: tab?.id })
      })
    })
  },
  reply<TPayload, TResponse>(topic: string, callback: CallbackFunction<TPayload, TResponse>) {
    const listener = async (
      message: SendMessage<TPayload>,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void
    ) => {
      if (!isValidSend({ message, topic })) return

      const repliedTopic = message.topic.replace('>', '<')

      const [tab] = await getActiveTabs()

      try {
        const response = await callback(message.payload, {
          id: message.id,
          sender,
          topic: message.topic
        })
        sendMessage(
          {
            topic: repliedTopic,
            payload: { response },
            id: message.id
          },
          { tabId: tab?.id }
        )
      } catch (error_) {
        // Errors do not serialize properly over `chrome.runtime.sendMessage`, so
        // we are manually serializing it to an object.
        const error: Record<string, unknown> = {}
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.getOwnPropertyNames(error_)) {
          error[key] = (<Error>error_)[<keyof Error>key]
        }
        sendMessage(
          {
            topic: repliedTopic,
            payload: { error },
            id: message.id
          },
          {
            tabId: tab?.id
          }
        )
      }
      sendResponse({})
      return true
    }
    chrome.runtime.onMessage?.addListener(listener)
    return () => chrome.runtime.onMessage?.removeListener(listener)
  }
})
