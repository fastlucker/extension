import HDKey from 'hdkey'

import { BIP44_TREZOR_TEMPLATE, DERIVATION } from '@ambire-common/consts/derivation'
import { ExternalKey } from '@ambire-common/interfaces/keystore'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import trezorConnect from '@trezor/connect-web'
import TrezorKeyIterator from '@web/modules/hardware-wallet/libs/trezorKeyIterator'

const keyringType = 'trezor'

const TREZOR_CONNECT_MANIFEST = {
  email: 'contactus@ambire.com',
  appUrl: 'https://wallet.ambire.com' // TODO: extension url?
}

class TrezorController {
  type: string

  hdk: any

  derivation: ExternalKey['meta']['derivation']

  hdPathTemplate: ExternalKey['meta']['hdPathTemplate']

  model: string = 'unknown'

  constructor() {
    this.type = keyringType
    this.hdk = new HDKey()

    // TODO: Handle different derivation
    this.derivation = DERIVATION.BIP44
    this.hdPathTemplate = BIP44_TREZOR_TEMPLATE

    trezorConnect.on('DEVICE_EVENT', (event: any) => {
      if (event && event.payload && event.payload.features) {
        this.model = event.payload.features.model
      }
    })

    trezorConnect.init({ manifest: TREZOR_CONNECT_MANIFEST, lazyLoad: true, popup: true })
  }

  getModel() {
    return this.model
  }

  dispose() {
    // This removes the Trezor Connect iframe from the DOM
    // This method is not well documented, but the code it calls can be seen
    // here: https://github.com/trezor/connect/blob/dec4a56af8a65a6059fb5f63fa3c6690d2c37e00/src/js/iframe/builder.js#L181
    trezorConnect.dispose()
  }

  cleanUp() {
    this.hdk = new HDKey()
  }

  isUnlocked() {
    return Boolean(this.hdk && this.hdk.publicKey)
  }

  unlock() {
    if (this.isUnlocked()) {
      return Promise.resolve('already unlocked')
    }
    return new Promise((resolve, reject) => {
      trezorConnect
        .getPublicKey({
          path: getHdPathFromTemplate(this.hdPathTemplate, 0),
          coin: 'ETH'
        })
        .then((response) => {
          if (response.success) {
            this.hdk.publicKey = Buffer.from(response.payload.publicKey, 'hex')
            this.hdk.chainCode = Buffer.from(response.payload.chainCode, 'hex')
            resolve('just unlocked')
          } else {
            reject(new Error((response.payload && response.payload.error) || 'Unknown error'))
          }
        })
        .catch((e) => {
          reject(new Error((e && e.toString()) || 'Unknown error'))
        })
    })
  }

  async getKeys(from: number = 0, to: number = 4) {
    return new Promise((resolve, reject) => {
      this.unlock()
        .then(async () => {
          const iterator = new TrezorKeyIterator({
            hdk: this.hdk
          })
          const keys = await iterator.retrieve(from, to)

          resolve(keys)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  exportAccount() {
    return Promise.reject(new Error('Not supported on this device'))
  }

  forgetDevice() {
    this.hdk = new HDKey()
  }
}

export default TrezorController
