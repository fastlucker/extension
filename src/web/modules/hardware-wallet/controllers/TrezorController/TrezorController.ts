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

  unlockedPath: string = ''

  unlockedPathKeyAddr: string = ''

  hdPathTemplate: HD_PATH_TEMPLATE_TYPE

  deviceModel = 'unknown'

  deviceId = ''

  constructor() {
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
    this.unlockedPath = ''
    this.unlockedPathKeyAddr = ''
  }

  isUnlocked() {
    // TODO: That's not the best way to check if the Trezor is unlocked
    return Boolean(this.hdk && this.hdk.publicKey)
  }

  async unlock(path?: ReturnType<typeof getHdPathFromTemplate>, expectedKeyOnThisPath?: string) {
    const pathToUnlock = path || getHdPathFromTemplate(this.hdPathTemplate, 0)

    // Unlocked, but with different path
    if (
      this.isUnlocked() &&
      (this.unlockedPathKeyAddr !== expectedKeyOnThisPath || this.unlockedPath !== pathToUnlock)
    ) {
      throw new Error('Trezor is already unlocked with a different path.')
    }

    if (
      this.isUnlocked() &&
      this.unlockedPathKeyAddr === expectedKeyOnThisPath &&
      this.unlockedPath === path
    ) {
      return 'ALREADY_UNLOCKED'
    }

    try {
      const response = await trezorConnect.getPublicKey({ path: pathToUnlock, coin: 'ETH' })

      if (!response.success) {
        throw new Error(response.payload.error || 'Failed to unlock Trezor for unknown reason.')
      }

      this.unlockedPath = pathToUnlock
      this.unlockedPathKeyAddr = response.payload.publicKey

      this.hdk.publicKey = Buffer.from(response.payload.publicKey, 'hex')
      this.hdk.chainCode = Buffer.from(response.payload.chainCode, 'hex')

      return 'JUST_UNLOCKED'
    } catch (e: any) {
      throw new Error(e?.message || e?.toString() || 'Failed to unlock Trezor for unknown reason.')
    }
  }
}

export default TrezorController
