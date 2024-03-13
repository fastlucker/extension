import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { Storage } from '@ambire-common/interfaces/storage'
import dappCatalogList from '@common/constants/dappCatalogList.json'
import { browser } from '@web/constants/browserapi'
import permission from '@web/extension-services/background/services/permission'
import { Session, SessionProp } from '@web/extension-services/background/services/session'

export type Dapp = {
  id: string
  name: string
  description?: string
  url: string
  iconUrl: string
  favorite: boolean
}
export class DappsController extends EventEmitter {
  dappsSessionMap: Map<string, Session>

  #_dapps: Dapp[] = []

  #storage: Storage

  #initialLoadPromise: Promise<void>

  constructor(_storage: Storage) {
    super()

    this.dappsSessionMap = new Map<string, Session>()
    this.#storage = _storage

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

    this.#initialLoadPromise = this.#load()
  }

  get dapps() {
    return this.#_dapps
  }

  set dapps(val: Dapp[]) {
    const updatedDapps = val.sort((a, b) => a.name.localeCompare(b.name))
    this.#_dapps = updatedDapps
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#storage.set('dapps', updatedDapps)
  }

  async #load() {
    let storedDapps: Dapp[]
    storedDapps = await this.#storage.get('dapps', [])
    if (!storedDapps.length) {
      storedDapps = dappCatalogList.map((dapp) => ({
        ...dapp,
        id: `${dapp.name}-${dapp.url}`,
        favorite: false
      }))
      await this.#storage.set('dapps', storedDapps)
    }

    this.#_dapps = storedDapps
    this.emitUpdate()
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

  async addDapp(dapp: Dapp) {
    await this.#initialLoadPromise

    const storedDapp = this.dapps.find(
      (d) => d.id === dapp.id || (d.name === dapp.name && d.url === dapp.url)
    )
    if (storedDapp) return
    this.dapps = [...this.dapps, dapp]
    this.emitUpdate()
  }

  async updateDapp(dapp: Dapp) {
    await this.#initialLoadPromise

    this.dapps = this.dapps.map((d) => {
      if (d.id === dapp.id) return { ...d, ...dapp }
      return d
    })
    this.emitUpdate()
  }

  async removeDapp(dappId: string) {
    this.dapps = this.dapps.filter((d) => d.id !== dappId)
    this.emitUpdate()
  }

  toJSON() {
    return {
      ...this,
      ...super.toJSON(),
      dappsSessionMap: Object.fromEntries(this.dappsSessionMap),
      dapps: this.dapps
    }
  }
}
