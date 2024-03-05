/* eslint-disable @typescript-eslint/no-floating-promises */
import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import { browser } from '@web/constants/browserapi'
import { Action as ActionType } from '@web/extension-services/background/actions'

export type Port = chrome.runtime.Port & { id: string }

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

/**
 * Creates a "port messenger" that can be used for communication between ui <-> background.
 *
 * Compatible connections:
 * - ❌ Background <-> Inpage
 * - ✅ UI <-> Background
 * - ❌ Background <-> Content Script
 * - ❌ Content Script <-> Inpage
 */

export class PortMessenger {
  ports: Port[] = []

  id: string = new Date().getTime().toString()

  constructor(ports: Port[] = []) {
    this.ports = ports
  }

  addPort(port: Port) {
    this.ports = [...this.ports, port]
    console.log(this.ports)
  }

  removePort(portId: string) {
    this.ports = this.ports.filter((port) => port.id !== portId)
  }

  connect = (name?: string) => {
    this.ports[0] = browser.runtime.connect(undefined, name ? { name } : undefined)
  }

  listen = (callback: ListenCallbackType) => {
    if (!this.ports.length) return

    this.ports.forEach((port) => {
      port.onMessage.addListener((data) => {
        if (!data.messageType || !data.message) return

        const message = parse(data.message)
        callback(data.messageType, message)
      })
    })
  }

  send: SendType = (type, message) => {
    if (!this.ports.length) return

    this.ports.forEach((port) => {
      port.postMessage({ messageType: type, message: stringify(message) })
    })
  }

  dispose = (portId: string) => {
    const port = this.ports.find((p) => p.id === portId)
    if (port) port.disconnect()
  }

  disposeAll = () => {
    if (!this.ports.length) return

    this.ports.forEach((port) => {
      port.disconnect()
    })
    this.ports = []
  }
}
