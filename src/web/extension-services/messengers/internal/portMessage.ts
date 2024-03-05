import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import { browser } from '@web/constants/browserapi'
import { Action as ActionType } from '@web/extension-services/background/actions'

type MessageType = '> ui' | '> ui-error' | '> background'

type SendType = <TMessageType extends MessageType>(
  type: MessageType,
  message: TMessageType extends '> background' ? ActionType : PortMessageType
) => void

type ListenCallbackType = <TMessageType extends MessageType>(
  type: MessageType,
  message: TMessageType extends '> background' ? ActionType : PortMessageType
) => Promise<any> | void

export type PortMessageType = {
  method: string
  params: any
}

class PortMessage {
  port?: chrome.runtime.Port

  id: string = new Date().getTime().toString()

  constructor(port?: chrome.runtime.Port) {
    if (port) this.port = port
  }

  connect = (name?: string) => {
    this.port = browser.runtime.connect(undefined, name ? { name } : undefined)
  }

  listen = (callback: ListenCallbackType) => {
    if (!this.port) return
    this.port.onMessage.addListener((data) => {
      if (!data.messageType || !data.message) return

      const message = parse(data.message)
      callback(data.messageType, message)
    })
  }

  send: SendType = (type, message) => {
    if (!this.port) return
    this.port.postMessage({ messageType: type, message: stringify(message) })
  }

  dispose = () => {
    this.port?.disconnect()
  }
}

export default PortMessage
