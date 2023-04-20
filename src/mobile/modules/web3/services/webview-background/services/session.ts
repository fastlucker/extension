import permissionService from '@mobile/modules/web3/services/webview-background/services/permission'

export interface SessionProp {
  origin: string
  icon: string
  name: string
}

export class Session {
  origin = ''

  icon = ''

  name = ''

  webViewRef = null

  pushMessage(event: any, data: any) {
    this.webViewRef?.current?.injectJavaScript(`handleBackgroundMessage(${JSON.stringify(data)});`)
  }

  constructor(data: SessionProp | null, webViewRef: any) {
    this.webViewRef = webViewRef
    if (data) {
      this.setProp(data)
    }
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

const createSession = (key: string, data: null | SessionProp, webViewRef) => {
  const session = new Session(data, webViewRef)
  sessionMap.set(key, session)

  return session
}

const getOrCreateSession = (id: number, origin: string, webViewRef) => {
  if (sessionMap.has(`${id}-${origin}`)) {
    return getSession(`${id}-${origin}`)
  }

  return createSession(`${id}-${origin}`, null, webViewRef)
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
      session.data.pushMessage?.(ev, data)
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
