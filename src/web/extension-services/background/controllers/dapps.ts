import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { Dapp } from '@ambire-common/interfaces/dapp'
import { Storage } from '@ambire-common/interfaces/storage'
import predefinedDapps from '@common/constants/dappCatalog.json'
import { browser } from '@web/constants/browserapi'
import { Session, SessionProp } from '@web/extension-services/background/services/session'

export class DappsController extends EventEmitter {
  dappsSessionMap: Map<string, Session>

  #_dapps: Dapp[] = []

  #storage: Storage

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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#load()
  }

  get isReady() {
    return !!this.dapps
  }

  get dapps(): Dapp[] {
    return this.#_dapps
  }

  set dapps(val: Dapp[]) {
    const updatedDapps = val
    this.#_dapps = updatedDapps
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#storage.set('dapps', updatedDapps)
  }

  async #load() {
    let storedDapps: Dapp[]
    storedDapps = await this.#storage.get('dapps', [])
    if (!storedDapps.length) {
      storedDapps = predefinedDapps.map((dapp) => ({
        ...dapp,
        chainId: 1,
        favorite: false,
        isConnected: false
      }))
      await this.#storage.set('dapps', storedDapps)
    }

    this.#_dapps = storedDapps
    this.emitUpdate()
  }

  #createDappSession = (key: string, tabId: number, data: SessionProp | null = null) => {
    const dappSession = new Session(data, tabId)
    this.dappsSessionMap.set(key, dappSession)
    this.emitUpdate()

    return dappSession
  }

  getOrCreateDappSession = (tabId: number, origin: string) => {
    if (this.dappsSessionMap.has(`${tabId}-${origin}`)) {
      return this.dappsSessionMap.get(`${tabId}-${origin}`) as Session
    }

    return this.#createDappSession(`${tabId}-${origin}`, tabId)
  }

  deleteDappSession = (key: string) => {
    this.dappsSessionMap.delete(key)
    this.emitUpdate()
  }

  broadcastDappSessionEvent = (ev: any, data?: any, origin?: string) => {
    let dappSessions: { key: string; data: Session }[] = []
    this.dappsSessionMap.forEach((session, key) => {
      if (session && this.hasPermission(session.origin)) {
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

  addDapp(dapp: Dapp) {
    if (!this.isReady) return

    const doesAlreadyExist = this.dapps.find((d) => d.url === dapp.url)
    if (doesAlreadyExist) {
      this.updateDapp(dapp.url, {
        chainId: dapp.chainId,
        isConnected: dapp.isConnected,
        favorite: dapp.favorite
      })
      return
    }
    this.dapps = [...this.dapps, dapp]
    this.emitUpdate()
  }

  updateDapp(url: string, dapp: Partial<Dapp>) {
    if (!this.isReady) return

    this.dapps = this.dapps.map((d) => {
      if (d.url === url) return { ...d, ...dapp }
      return d
    })
    this.emitUpdate()
  }

  removeDapp(url: string) {
    if (!this.isReady) return

    // do not remove predefined dapps
    if (predefinedDapps.find((d) => d.url === url)) return

    this.dapps = this.dapps.filter((d) => d.url !== url)
    this.emitUpdate()
  }

  hasPermission(url: string) {
    const dapp = this.dapps.find((d) => d.url === url)
    if (!dapp) return false

    return dapp.isConnected
  }

  getDapp(url: string) {
    if (!this.isReady) return

    return this.dapps.find((d) => d.url === url)
  }

  toJSON() {
    return {
      ...this,
      ...super.toJSON(),
      dappsSessionMap: Object.fromEntries(this.dappsSessionMap),
      dapps: this.dapps,
      isReady: this.isReady
    }
  }
}
