// @ts-nocheck

import { parse, stringify } from '@ambire-common/libs/bigintJson/bigintJson'
import { browser } from '@web/constants/browserapi'

import Message from './baseMessage'

class PortMessage extends Message {
  port: any = null

  id: string

  listenCallback: any

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
    this.port.onMessage.addListener((message) => {
      // message should be a stringified json but in some cases it comes as an object
      // and in that case if parsing fails it defaults to destructing the message object
      try {
        const { _type_, data } = parse(message)
        if (_type_ === `${this._EVENT_PRE}message`) {
          this.emit('message', data)
          return
        }

        if (_type_ === `${this._EVENT_PRE}response`) {
          this.onResponse(data)
        }
      } catch (error) {
        const { _type_, data } = message
        if (_type_ === `${this._EVENT_PRE}message`) {
          this.emit('message', data)
          return
        }

        if (_type_ === `${this._EVENT_PRE}response`) {
          this.onResponse(data)
        }
      }
    })

    return this
  }

  listen = (listenCallback: any) => {
    if (!this.port) return
    this.listenCallback = listenCallback
    this.port.onMessage.addListener((message) => {
      // message should be a stringified json but in some cases it comes as an object
      // and in that case if parsing fails it defaults to destructing the message object
      try {
        const { _type_, data } = parse(message)
        if (_type_ === `${this._EVENT_PRE}request`) {
          this.onRequest(data)
        }
      } catch (error) {
        const { _type_, data } = message
        if (_type_ === `${this._EVENT_PRE}request`) {
          this.onRequest(data)
        }
      }
    })

    return this
  }

  send = (type, data) => {
    if (!this.port) return
    try {
      const message = stringify({ _type_: `${this._EVENT_PRE}${type}`, data })
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
