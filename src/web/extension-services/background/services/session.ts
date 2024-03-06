import permissionService from '@web/extension-services/background/services/permission'
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

// for each tab
const sessionMap = new Map<string, Session | null>()

const getSession = (key: string) => {
  return sessionMap.get(key)
}

const createSession = (key: string, data?: null | SessionProp) => {
  const session = new Session(data)
  sessionMap.set(key, session)

  return session
}

const getOrCreateSession = (id: number, origin: string) => {
  if (sessionMap.has(`${id}-${origin}`)) {
    return sessionMap.get(`${id}-${origin}`) as Session
  }

  return createSession(`${id}-${origin}`, null)
}
const deleteSession = (key: string) => {
  sessionMap.delete(key)
}

const broadcastEvent = (ev: any, data?: any, origin?: string) => {
  let sessions: { key: string; data: Session }[] = []
  sessionMap.forEach((session, key) => {
    if (session && permissionService.hasPermission(session.origin)) {
      sessions.push({
        key,
        data: session
      })
    }
  })

  // same origin
  if (origin) {
    sessions = sessions.filter((session) => session.data.origin === origin)
  }

  sessions.forEach((session) => {
    try {
      session.data.sendMessage?.(ev, data)
    } catch (e) {
      if (sessionMap.has(session.key)) {
        deleteSession(session.key)
      }
    }
  })
}

export default {
  getSession,
  getOrCreateSession,
  deleteSession,
  broadcastEvent
}
