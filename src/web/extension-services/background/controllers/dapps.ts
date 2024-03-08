import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { browser } from '@web/constants/browserapi'
import permission from '@web/extension-services/background/services/permission'
import { Session, SessionProp } from '@web/extension-services/background/services/session'

export class DappsController extends EventEmitter {
  dappsSessionMap: Map<string, Session>

  constructor() {
    super()

    this.dappsSessionMap = new Map<string, Session>()

    try {
      browser.tabs.onRemoved.addListener((tabId: number) => {
        const sessionKeys = Array.from(this.dappsSessionMap.keys())
        // eslint-disable-next-line no-restricted-syntax
        for (const key of sessionKeys.filter((k) => k.startsWith(`${tabId}-`))) {
          this.deleteDappSession(key)
        }
      })
    } catch (error) {
      console.error('Failed to register browser.tabs.onRemoved.addListener', error)
    }
  }

  #createDappSession = (key: string, data: SessionProp | null = null) => {
    const dappSession = new Session(data)
    this.dappsSessionMap.set(key, dappSession)
    this.emitUpdate()

    return dappSession
  }

  getOrCreateDappSession = (tabId: number, origin: string) => {
    if (this.dappsSessionMap.has(`${tabId}-${origin}`)) {
      return this.dappsSessionMap.get(`${tabId}-${origin}`) as Session
    }

    return this.#createDappSession(`${tabId}-${origin}`)
  }

  deleteDappSession = (key: string) => {
    this.dappsSessionMap.delete(key)
    this.emitUpdate()
  }

  broadcastDappSessionEvent = (ev: any, data?: any, origin?: string) => {
    let dappSessions: { key: string; data: Session }[] = []
    this.dappsSessionMap.forEach((session, key) => {
      if (session && permission.hasPermission(session.origin)) {
        dappSessions.push({
          key,
          data: session
        })
      }
    })

    if (origin) {
      dappSessions = dappSessions.filter((dappSession) => dappSession.data.origin === origin)
    }

    dappSessions.forEach((dappSession) => {
      try {
        dappSession.data.sendMessage?.(ev, data)
      } catch (e) {
        if (this.dappsSessionMap.has(dappSession.key)) {
          this.deleteDappSession(dappSession.key)
        }
      }
    })
    this.emitUpdate()
  }

  toJSON() {
    return {
      ...this,
      ...super.toJSON(),
      dappsSessionMap: Object.fromEntries(this.dappsSessionMap)
    }
  }
}
