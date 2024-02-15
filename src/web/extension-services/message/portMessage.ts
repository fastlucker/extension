import { parse, stringify } from '@ambire-common/libs/richJson/richJson'
import { browser } from '@web/constants/browserapi'

import Message from './baseMessage'

class PortMessage extends Message {
  port: any = null

  id?: string

  constructor(port?: any, id?: string) {
    super()

    if (port) {
      this.port = port
    }

    if (id) {
      this.id = id
    }
  }

  connect = (name?: string) => {
    this.port = browser.runtime.connect(undefined, name ? { name } : undefined)
    this.port.onMessage.addListener((message: any) => {
      // message should be a stringified json but in some cases it comes as an object
      // and in that case if parsing fails it defaults to destructing the message object
      try {
        const { messageType, data } = parse(message)
        if (messageType === `${this.EVENT_PREFIX}message`) {
          this.emit('message', data)
          return
        }

        if (messageType === `${this.EVENT_PREFIX}response`) {
          this.onResponse(data)
        }
      } catch (error) {
        const { messageType, data } = message
        if (messageType === `${this.EVENT_PREFIX}message`) {
          this.emit('message', data)
          return
        }

        if (messageType === `${this.EVENT_PREFIX}response`) {
          this.onResponse(data)
        }
      }
    })

    return this
  }

  listen = (listenCallback: Function) => {
    if (!this.port) return
    this.listenCallback = listenCallback
    this.port.onMessage.addListener((message: string | object) => {
      // message should be a stringified json but in some cases it comes as an object
      // and in that case if parsing fails it defaults to destructing the message object
      try {
        const { messageType, data } = parse(message as string)
        if (messageType === `${this.EVENT_PREFIX}request`) {
          this.onRequest(data)
        }
        if (messageType === 'broadcast') {
          !!this.listenCallback && this.listenCallback(data)
        }
      } catch (error) {
        const { messageType, data }: any = message
        if (messageType === `${this.EVENT_PREFIX}request`) {
          this.onRequest(data)
        }
        if (messageType === 'broadcast') {
          !!this.listenCallback && this.listenCallback(data)
        }
      }
    })

    return this
  }

  send = (type: string, data: any) => {
    if (!this.port) return
    try {
      let message

      if (type === 'broadcast') {
        message = stringify({ messageType: type, data })
      } else {
        message = stringify({ messageType: `${this.EVENT_PREFIX}${type}`, data })
      }
      this.port.postMessage(message)
    } catch (e) {
      // DO NOTHING BUT CATCH THIS ERROR
    }
  }

  dispose = () => {
    this._dispose()
    this.port?.disconnect()
  }
}

export default PortMessage
