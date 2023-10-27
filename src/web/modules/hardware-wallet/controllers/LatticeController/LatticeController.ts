import crypto from 'crypto'
import EventEmitter from 'events'
import * as SDK from 'gridplus-sdk'

import {
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { ExternalKey } from '@ambire-common/interfaces/keystore'
import LatticeKeyIterator from '@web/modules/hardware-wallet/libs/latticeKeyIterator'

const keyringType = 'lattice'

const SDK_TIMEOUT = 120000
const CONNECT_TIMEOUT = 20000

class LatticeController extends EventEmitter {
  appName: string

  type: string

  hdPathTemplate: HD_PATH_TEMPLATE_TYPE

  sdkSession?: SDK.Client | null

  creds: any

  unlockedAccount: any

  accountIndices: any

  isLocked: boolean = true

  network: any

  deviceId = ''

  // There is only one Grid+ device
  deviceModel = 'lattice'

  constructor() {
    super()
    this.appName = 'Ambire Wallet Extension'
    this.type = keyringType
    this.hdPathTemplate = BIP44_STANDARD_DERIVATION_TEMPLATE
    this._resetDefaults()
  }

  setHdPath(hdPathTemplate: HD_PATH_TEMPLATE_TYPE) {
    this.hdPathTemplate = hdPathTemplate
  }

  // Deterimine if we have a connection to the Lattice and an existing wallet UID
  // against which to make requests.
  isUnlocked() {
    return !!this._getCurrentWalletUID() && !!this.sdkSession
  }

  // Initialize a session with the Lattice1 device using the GridPlus SDK
  // NOTE: `bypassOnStateData=true` allows us to rehydrate a new SDK session without
  // reconnecting to the target Lattice. This is only currently used for signing
  // because it eliminates the need for 2 connection requests and shaves off ~4-6sec.
  // We avoid passing `bypassOnStateData=true` for other calls on `unlock` to avoid
  // possible edge cases related to this new functionality (it's probably fine - just
  // being cautious). In the future we may remove `bypassOnStateData` entirely.
  async unlock(bypassOnStateData = false) {
    if (this.isUnlocked()) {
      return 'Unlocked'
    }
    const creds: any = await this._getCreds()
    if (creds) {
      this.creds.deviceID = creds.deviceID
      this.creds.password = creds.password
      this.creds.endpoint = creds.endpoint || null
    }
    const includedStateData = await this._initSession()
    // If state data was provided and if we are authorized to
    // bypass reconnecting, we can exit here.
    if (includedStateData && bypassOnStateData) {
      return 'Unlocked'
    }
    await this._connect()
    return 'Unlocked'
  }

  async exportAccount(address) {
    throw new Error('exportAccount not supported by this device')
  }

  async getKeys(from: number = 0, to: number = 4) {
    await this.unlock()

    if (!this.isUnlocked()) {
      throw new Error('No connection to Lattice. Cannot fetch addresses.')
    }

    return new Promise((resolve) => {
      ;(async () => {
        const iterator = new LatticeKeyIterator({
          sdkSession: this.sdkSession
        })

        const keys = await iterator.retrieve(from, to, this.hdPathTemplate)

        resolve(keys)
      })()
    })
  }

  forgetDevice() {
    this._resetDefaults()
  }

  _resetDefaults() {
    this.accountIndices = []
    this.isLocked = true
    this.creds = {
      deviceID: null,
      password: null,
      endpoint: null
    }
    this.deviceId = ''
    this.sdkSession = null
    this.unlockedAccount = 0
    this.network = null
    this.hdPathTemplate = BIP44_STANDARD_DERIVATION_TEMPLATE
  }

  async _openConnectorTab(url) {
    try {
      const browserTab = window.open(url)
      // Preferred option for Chromium browsers. This extension runs in a window
      // for Chromium so we can do window-based communication very easily.
      if (browserTab) {
        return { chromium: browserTab }
      }
      if (browser && browser.tabs && browser.tabs.create) {
        // FireFox extensions do not run in windows, so it will return `null` from
        // `window.open`. Instead, we need to use the `browser` API to open a tab.
        // We will surveille this tab to see if its URL parameters change, which
        // will indicate that the user has logged in.
        const tab = await browser.tabs.create({ url })
        return { firefox: tab }
      }
      throw new Error('Unknown browser context. Cannot open Lattice connector.')
    } catch (err) {
      throw new Error('Failed to open Lattice connector.')
    }
  }

  async _findTabById(id) {
    const tabs = await browser.tabs.query({})
    return tabs.find((tab) => tab.id === id)
  }

  _getCreds() {
    return new Promise((resolve, reject) => {
      // We only need to setup if we don't have a deviceID
      if (this._hasCreds()) return resolve()
      // If we are not aware of what Lattice we should be talking to,
      // we need to open a window that lets the user go through the
      // pairing or connection process.
      const name = this.appName ? this.appName : 'Unknown'
      const base = 'https://lattice.gridplus.io'
      const url = `${base}?keyring=${name}&forceLogin=true`
      let listenInterval: any

      // PostMessage handler
      function receiveMessage(event) {
        // Ensure origin
        if (event.origin !== base) return
        try {
          // Stop the listener
          clearInterval(listenInterval)
          // Parse and return creds
          const creds = JSON.parse(event.data)
          if (!creds.deviceID || !creds.password)
            return reject(new Error('Invalid credentials returned from Lattice.'))
          return resolve(creds)
        } catch (err) {
          return reject(err)
        }
      }

      // Open the tab
      this._openConnectorTab(url).then((conn) => {
        if (conn.chromium) {
          // On a Chromium browser we can just listen for a window message
          window.addEventListener('message', receiveMessage, false)
          // Watch for the open window closing before creds are sent back
          listenInterval = setInterval(() => {
            if (conn.chromium.closed) {
              clearInterval(listenInterval)
              return reject(new Error('Lattice connector closed.'))
            }
          }, 500)
        } else if (conn.firefox) {
          // For Firefox we cannot use `window` in the extension and can't
          // directly communicate with the tabs very easily so we use a
          // workaround: listen for changes to the URL, which will contain
          // the login info.
          // NOTE: This will only work if have `https://lattice.gridplus.io/*`
          // host permissions in your manifest file (and also `activeTab` permission)
          const loginUrlParam = '&loginCache='
          listenInterval = setInterval(() => {
            this._findTabById(conn.firefox.id).then((tab) => {
              if (!tab || !tab.url) {
                return reject(new Error('Lattice connector closed.'))
              }
              // If the tab we opened contains a new URL param
              const paramLoc = tab.url.indexOf(loginUrlParam)
              if (paramLoc < 0) return
              const dataLoc = paramLoc + loginUrlParam.length
              // Stop this interval
              clearInterval(listenInterval)
              try {
                // Parse the login data. It is a stringified JSON object
                // encoded as a base64 string.
                const _creds = Buffer.from(tab.url.slice(dataLoc), 'base64').toString()
                // Close the tab and return the credentials
                browser.tabs.remove(tab.id).then(() => {
                  const creds = JSON.parse(_creds)
                  if (!creds.deviceID || !creds.password)
                    return reject(new Error('Invalid credentials returned from Lattice.'))
                  return resolve(creds)
                })
              } catch (err) {
                return reject('Failed to get login data from Lattice. Please try again.')
              }
            })
          }, 500)
        }
      })
    })
  }

  // [re]connect to the Lattice. This should be done frequently to ensure
  // the expected wallet UID is still the one active in the Lattice.
  // This will handle SafeCard insertion/removal events.
  async _connect() {
    try {
      // Attempt to connect with a Lattice using a shorter timeout. If
      // the device is unplugged it will time out and we don't need to wait
      // 2 minutes for that to happen.
      this.sdkSession.timeout = CONNECT_TIMEOUT
      await this.sdkSession.connect(this.creds.deviceID)
      this.deviceId = this._getCurrentWalletUID()
    } finally {
      // Reset to normal timeout no matter what
      this.sdkSession.timeout = SDK_TIMEOUT
    }
  }

  async _initSession() {
    if (this.isUnlocked()) {
      return
    }
    let url = 'https://signing.gridpl.us'
    if (this.creds.endpoint) url = this.creds.endpoint
    const setupData = {
      name: this.appName,
      baseUrl: url,
      timeout: SDK_TIMEOUT,
      privKey: this._genSessionKey(),
      network: this.network,
      skipRetryOnWrongWallet: true
    }
    /*
    NOTE: We need state to actually be synced by MetaMask or we can't
    use this. See: https://github.com/MetaMask/KeyringController/issues/130
    if (this.sdkState) {
      // If we have state data we can fully rehydrate the session.
      setupData = {
        stateData: this.sdkState,
        skipRetryOnWrongWallet: true,
      }
    }
    */
    this.sdkSession = new SDK.Client(setupData)
    // Return a boolean indicating whether we provided state data.
    // If we have, we can skip `connect`.
    return !!setupData.stateData
  }

  _hasCreds() {
    return this.creds.deviceID !== null && this.creds.password !== null && this.appName
  }

  _genSessionKey() {
    if (this.name && !this.appName)
      // Migrate from legacy param if needed
      this.appName = this.name
    if (!this._hasCreds()) throw new Error('No credentials -- cannot create session key!')
    const buf = Buffer.concat([
      Buffer.from(this.creds.password),
      Buffer.from(this.creds.deviceID),
      Buffer.from(this.appName)
    ])

    return crypto.createHash('sha256').update(buf).digest()
  }

  _getCurrentWalletUID() {
    if (!this.sdkSession) {
      return ''
    }
    const activeWallet = this.sdkSession.getActiveWallet()
    if (!activeWallet || !activeWallet.uid) {
      return ''
    }
    return activeWallet.uid.toString('hex')
  }

  async _keyIdxInCurrentWallet(key: ExternalKey) {
    // Get the last updated SDK wallet UID
    const activeWallet = this.sdkSession!.getActiveWallet()
    if (!activeWallet) {
      this._connect()
      throw new Error('No active wallet in Lattice.')
    }
    const activeUID = activeWallet.uid.toString('hex')
    // If this is already the active wallet we don't need to make a request
    if (key.meta.deviceId === activeUID) {
      return key.meta!.index
    }
    return null
  }
}

export default LatticeController
