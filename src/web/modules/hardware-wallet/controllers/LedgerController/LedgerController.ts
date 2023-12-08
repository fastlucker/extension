import HDKey from 'hdkey'

import {
  BIP44_LEDGER_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { ExternalSignerController } from '@ambire-common/interfaces/keystore'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import LedgerEth from '@ledgerhq/hw-app-eth'
import Transport from '@ledgerhq/hw-transport'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'

export const wait = (fn: () => void, ms = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn()
      resolve(true)
    }, ms)
  })
}

class LedgerController implements ExternalSignerController {
  hdk: any

  // hasHIDPermission: boolean | null

  hdPathTemplate: HD_PATH_TEMPLATE_TYPE

  isWebHID: boolean

  transport: TransportWebHID | null

  app: null | LedgerEth

  type = 'ledger'

  deviceModel = 'unknown'

  deviceId = ''

  constructor() {
    this.hdk = new HDKey()
    // this.hasHIDPermission = null
    // TODO: make it optional (by default should be false and set it to true only when there is ledger connected via usb)
    this.isWebHID = true
    this.transport = null
    this.app = null
    // TODO: Handle different derivation
    this.hdPathTemplate = BIP44_LEDGER_DERIVATION_TEMPLATE
  }

  isUnlocked() {
    return Boolean(this.hdk && this.hdk.publicKey)
  }

  async initAppIfNeeded() {
    if (this.app) return

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
      throw new Error(
        'Could not establish connection with your Ledger device. Please make sure it is connected via USB.'
      )
    }
  }

  async unlock(path?: ReturnType<typeof getHdPathFromTemplate>) {
    if (this.isUnlocked()) {
      return 'ALREADY_UNLOCKED'
    }

    if (!this.isWebHID) {
      throw new Error(
        'Ledger only supports USB connection between Ambire and your device. Please connect your device via USB.'
      )
    }

    await this.initAppIfNeeded()
    if (!this.app) {
      throw new Error(
        'Could not establish connection with your Ledger device. Please make sure it is connected via USB.'
      )
    }

    try {
      const res = await this.app.getAddress(
        path || getHdPathFromTemplate(this.hdPathTemplate, 0),
        false,
        true
      )
      const { publicKey, chainCode } = res
      this.hdk.publicKey = Buffer.from(publicKey, 'hex')
      this.hdk.chainCode = Buffer.from(chainCode!, 'hex')

      return 'JUST_UNLOCKED'
    } catch (error: any) {
      const message = error?.message || error?.toString() || 'Ledger device: no response.'

      throw new Error(
        `Could not connect to your Ledger device. Please make sure it is connected, unlocked and running the Ethereum app. \n${message}`
      )
    }
  }

  // TODO: Probably not needed?
  authorizeHIDPermission() {
    this.hasHIDPermission = true
  }

  async cleanUp() {
    this.app = null
    if (this.transport) this.transport.close()
    this.transport = null
    this.hdk = new HDKey()
  }

  // TODO: Probably not needed?
  // async reconnect() {
  //   if (this.isWebHID) {
  //     await this.cleanUp()

  //     let count = 0
  //     // wait connect the WebHID
  //     while (!this.app) {
  //       // eslint-disable-next-line no-await-in-loop
  //       await this.initAppIfNeeded()
  //       // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func
  //       await wait(() => {
  //         if (count++ > 50) {
  //           throw new Error('Ledger: Failed to connect to Ledger')
  //         }
  //       }, 100)
  //     }
  //   }
  // }
}

export default LedgerController
