import HDKey from 'hdkey'

import { LEDGER_LIVE_HD_PATH } from '@ambire-common/consts/derivation'
import LedgerEth from '@ledgerhq/hw-app-eth'
import Transport from '@ledgerhq/hw-transport'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import LedgerKeyIterator from '@web/modules/hardware-wallet/libs/ledgerKeyIterator'

export const wait = (fn: () => void, ms = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn()
      resolve(true)
    }, ms)
  })
}

class LedgerController {
  hdk: any

  hasHIDPermission: boolean | null

  accounts: any

  hdPath: string = LEDGER_LIVE_HD_PATH

  isWebHID: boolean

  transport: Transport | null

  app: null | LedgerEth

  type = 'ledger'

  model = 'unknown'

  constructor() {
    this.hdk = new HDKey()
    this.hasHIDPermission = null
    // TODO: make it optional (by default should be false and set it to true only when there is ledger connected via usb)
    this.isWebHID = true
    this.transport = null
    this.app = null
  }

  isUnlocked() {
    return Boolean(this.hdk && this.hdk.publicKey)
  }

  setHdPath(hdPath: string) {
    // Reset HDKey if the path changes
    if (this.hdPath !== hdPath) {
      this.hdk = new HDKey()
    }
    this.hdPath = hdPath
  }

  async makeApp() {
    if (!this.app) {
      try {
        // @ts-ignore
        this.transport = await TransportWebHID.create()
        this.app = new LedgerEth(this.transport as Transport)

        if (this.transport?.deviceModel?.id) {
          this.model = this.transport.deviceModel.id
        }
      } catch (e: any) {
        Promise.reject(new Error('ledgerController: permission rejected'))
      }
    }
  }

  async unlock(hdPath?: string) {
    if (this.isUnlocked() && !hdPath) {
      return 'ledgerController: already unlocked'
    }

    const path = hdPath ? this._toLedgerPath(hdPath) : this.hdPath
    if (this.isWebHID) {
      try {
        await this.makeApp()
        const res = await this.app!.getAddress(path, false, true)
        const { address, publicKey, chainCode } = res

        this.hdk.publicKey = Buffer.from(publicKey, 'hex')
        this.hdk.chainCode = Buffer.from(chainCode!, 'hex')

        return address
      } catch (error: any) {
        if (error?.statusCode === 25871 || error?.statusCode === 27404) {
          throw new Error('Please make sure your ledger is unlocked and running the Ethereum app.')
        }

        console.error(error)
        throw new Error(
          'Could not connect to your ledger device. Please make sure it is connected, unlocked and running the Ethereum app.'
        )
      }
    }

    return null
    // TODO: impl when isWebHID is false
  }

  authorizeHIDPermission() {
    this.hasHIDPermission = true
  }

  async getKeys(from: number = 0, to: number = 4) {
    return new Promise((resolve, reject) => {
      const unlockPromises = []

      for (let i = from; i <= to; i++) {
        const path = this._getPathForIndex(i)
        unlockPromises.push(this.unlock(path))
      }

      Promise.all(unlockPromises)
        .then(async () => {
          const iterator = new LedgerKeyIterator({
            hdk: this.hdk,
            app: this.app
          })
          const keys = await iterator.retrieve(from, to)

          resolve(keys)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  async cleanUp() {
    this.app = null
    if (this.transport) this.transport.close()
    this.transport = null
    this.hdk = new HDKey()
  }

  _getPathForIndex(index: number) {
    return this._isLedgerLiveHdPath() ? `m/44'/60'/${index}'/0/0` : `${this.hdPath}/${index}`
  }

  _toLedgerPath(path: string) {
    return path.toString().replace('m/', '')
  }

  _isLedgerLiveHdPath() {
    return this.hdPath === LEDGER_LIVE_HD_PATH
  }

  async _reconnect() {
    if (this.isWebHID) {
      await this.cleanUp()

      let count = 0
      // wait connect the WebHID
      while (!this.app) {
        // eslint-disable-next-line no-await-in-loop
        await this.makeApp()
        // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func
        await wait(() => {
          if (count++ > 50) {
            throw new Error('Ledger: Failed to connect to Ledger')
          }
        }, 100)
      }
    }
  }
}

export default LedgerController
