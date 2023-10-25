import HDKey from 'hdkey'

import { BIP44_LEDGER_LIVE_TEMPLATE } from '@ambire-common/consts/derivation'
import { ExternalKey } from '@ambire-common/interfaces/keystore'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
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

  hdPathTemplate: ExternalKey['meta']['hdPathTemplate']

  isWebHID: boolean

  transport: TransportWebHID | null

  app: null | LedgerEth

  type = 'ledger'

  deviceModel = 'unknown'

  deviceId = ''

  constructor() {
    this.hdk = new HDKey()
    this.hasHIDPermission = null
    // TODO: make it optional (by default should be false and set it to true only when there is ledger connected via usb)
    this.isWebHID = true
    this.transport = null
    this.app = null
    // TODO: Handle different derivation
    this.hdPathTemplate = BIP44_LEDGER_LIVE_TEMPLATE
  }

  isUnlocked() {
    return Boolean(this.hdk && this.hdk.publicKey)
  }

  setHdPath(hdPathTemplate: ExternalKey['meta']['hdPathTemplate']) {
    // Reset HDKey if the path changes
    if (this.hdPathTemplate !== hdPathTemplate) {
      this.hdk = new HDKey()
    }
    this.hdPathTemplate = hdPathTemplate
  }

  async makeApp() {
    if (!this.app) {
      try {
        // @ts-ignore
        this.transport = await TransportWebHID.create()
        this.app = new LedgerEth(this.transport as Transport)

        if (this.transport?.deviceModel?.id) {
          this.deviceModel = this.transport.deviceModel.id
        }
        if (this.transport?.device?.productId) {
          this.deviceId = this.transport.device.productId.toString()
        }
      } catch (e: any) {
        Promise.reject(new Error('ledgerController: permission rejected'))
      }
    }
  }

  async unlock(path?: string) {
    if (this.isUnlocked()) {
      return 'ledgerController: already unlocked'
    }

    if (this.isWebHID) {
      try {
        await this.makeApp()
        const res = await this.app!.getAddress(
          path || getHdPathFromTemplate(this.hdPathTemplate, 0),
          false,
          true
        )
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
        const path = getHdPathFromTemplate(this.hdPathTemplate, i)
        unlockPromises.push(this.unlock(path))
      }

      Promise.all(unlockPromises)
        .then(async () => {
          const iterator = new LedgerKeyIterator({
            hdk: this.hdk,
            app: this.app
          })
          const keys = await iterator.retrieve(from, to, this.hdPathTemplate)

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

  // TODO: remove?
  _toLedgerPath(path: string) {
    return path.toString().replace('m/', '')
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
