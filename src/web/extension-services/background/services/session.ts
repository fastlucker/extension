import { Messenger } from '@web/extension-services/messengers'

export interface SessionProp {
  origin: string
  icon: string
  name: string
}

export class Session {
  origin = ''

  icon = ''

  name = ''

  messenger: Messenger | null = null

  sendMessage(event: any, data: any) {
    if (this.messenger) {
      this.messenger.send('message', { event, data })
    }
  }

  constructor(data?: SessionProp | null) {
    if (data) {
      this.setProp(data)
    }
  }

  setMessenger(messenger: Messenger) {
    this.messenger = messenger
  }

  setProp({ origin, icon, name }: SessionProp) {
    this.origin = origin
    this.icon = icon
    this.name = name
  }
}
