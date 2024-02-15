import { ethErrors } from 'eth-rpc-errors'
import { EventEmitter } from 'events'

// used to extend BroadcastChannelMessage and PortMessage
abstract class Message extends EventEmitter {
  #requestIdPool = [...Array(1000).keys()]

  #waitingMap = new Map<
    number,
    {
      data: any
      resolve: (arg: any) => any
      reject: (arg: any) => any
    }
  >()

  protected EVENT_PREFIX = 'AMBIRE_WALLET_'

  protected listenCallback?: Function

  abstract send(type: string, data: any): void

  request = (data: any) => {
    if (!this.#requestIdPool.length) {
      console.error('Ambire Error: maximum pending requests limit exceeded!')
    }
    const ident = this.#requestIdPool.shift()!

    return new Promise((resolve, reject) => {
      this.#waitingMap.set(ident, {
        data,
        resolve,
        reject
      })

      this.send('request', { ident, data })
    })
  }

  onResponse = async ({ ident, res, err }: any = {}) => {
    if (!this.#waitingMap.has(ident)) return

    const { resolve, reject } = this.#waitingMap.get(ident)!

    this.#requestIdPool.push(ident)
    this.#waitingMap.delete(ident)
    err ? reject(err) : resolve(res)
  }

  onRequest = async ({ ident, data }: any) => {
    if (this.listenCallback) {
      let res: any
      let err: any

      try {
        res = await this.listenCallback(data)
      } catch (e: any) {
        err = {
          message: e.message || e,
          stack: e.stack
        }
        e.code && (err.code = e.code)
        e.data && (err.data = e.data)
      }
      this.send('response', { ident, res, err })
    }
  }

  _dispose = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const request of this.#waitingMap.values()) {
      request.reject(ethErrors.provider.userRejectedRequest())
    }

    this.#waitingMap.clear()
  }
}

export default Message
