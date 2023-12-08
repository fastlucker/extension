import HDKey from 'hdkey'

import {
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { ExternalSignerController } from '@ambire-common/interfaces/keystore'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import trezorConnect from '@trezor/connect-web'

const TREZOR_CONNECT_MANIFEST = {
  email: 'contactus@ambire.com',
  appUrl: 'https://wallet.ambire.com' // TODO: extension url?
}

class TrezorController implements ExternalSignerController {
  type = 'trezor'

  hdk: any

  hdPathTemplate: HD_PATH_TEMPLATE_TYPE

  deviceModel = 'unknown'

  deviceId = ''

  constructor() {
    this.hdk = new HDKey()

    // TODO: Handle different derivation
    this.hdPathTemplate = BIP44_STANDARD_DERIVATION_TEMPLATE

    trezorConnect.on('DEVICE_EVENT', (event: any) => {
      if (event?.payload?.features?.model) {
        this.deviceModel = event.payload.features.model
      }
      // The device ID could be retrieved from both places
      if (event?.payload?.features?.device_id || event?.payload?.id) {
        this.deviceId = event.payload.features.device_id || event.payload.id
      }
    })

    trezorConnect.init({ manifest: TREZOR_CONNECT_MANIFEST, lazyLoad: true, popup: true })
  }

  cleanUp() {
    this.hdk = new HDKey()
  }

  isUnlocked() {
    return Boolean(this.hdk && this.hdk.publicKey)
  }

  async unlock(path?: ReturnType<typeof getHdPathFromTemplate>) {
    if (this.isUnlocked()) {
      return 'ALREADY_UNLOCKED'
    }

    try {
      const response = await trezorConnect.getPublicKey({
        path: path || getHdPathFromTemplate(this.hdPathTemplate, 0),
        coin: 'ETH'
      })

      if (!response.success) {
        throw new Error(response.payload.error || 'Failed to unlock Trezor for unknown reason.')
      }

      this.hdk.publicKey = Buffer.from(response.payload.publicKey, 'hex')
      this.hdk.chainCode = Buffer.from(response.payload.chainCode, 'hex')

      return 'JUST_UNLOCKED'
    } catch (e: any) {
      throw new Error(e?.message || e?.toString() || 'Failed to unlock Trezor for unknown reason.')
    }
  }
}

export default TrezorController
