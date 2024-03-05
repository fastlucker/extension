import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import { browser } from '@web/constants/browserapi'

export type PortMessageType = {
  // TODO: add Action types
  type?: string
  method: string
  params: any
}

class PortMessage {
  port: chrome.runtime.Port

  id: string = new Date().getTime().toString()

  constructor(port: chrome.runtime.Port) {
    this.port = port
  }

  connect = (name?: string) => {
    this.port = browser.runtime.connect(undefined, name ? { name } : undefined)
  }

  listen = (
    callback: (
      msg: PortMessageType & { messageType: '> ui' | '> ui-error' | '> background' }
    ) => void
  ) => {
    if (!this.port) return
    this.port.onMessage.addListener((message: string) => {
      callback(parse(message))
    })
  }

  send = (type: '> ui' | '> ui-error' | '> background', message: PortMessageType) => {
    if (!this.port) return
    this.port.postMessage(stringify({ messageType: type, ...message }))
  }

  dispose = () => {
    this.port?.disconnect()
  }
}

export default PortMessage
