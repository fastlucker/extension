import Message from './baseMessage'

export default class BroadcastChannelMessage extends Message {
  #channel: BroadcastChannel

  constructor(name?: string) {
    super()
    if (!name) {
      throw new Error('the broadcastChannel name is missing')
    }

    this.#channel = new BroadcastChannel(name)
  }

  connect = () => {
    this.#channel.onmessage = ({ data: { type, data } }) => {
      if (type === 'message') {
        this.emit('message', data)
      } else if (type === 'response') {
        this.onResponse(data)
      }
    }

    return this
  }

  listen = (listenCallback: Function) => {
    this.listenCallback = listenCallback

    this.#channel.onmessage = ({ data: { type, data } }) => {
      if (type === 'request') this.onRequest(data)
    }

    return this
  }

  send = (type: string, data: any) => {
    this.#channel.postMessage({
      type,
      data
    })
  }

  dispose = () => {
    this._dispose()
    this.#channel.close()
  }
}
