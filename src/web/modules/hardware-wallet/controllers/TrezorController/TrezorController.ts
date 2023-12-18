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

  hdPathTemplate: HD_PATH_TEMPLATE_TYPE

  unlockedPath: string = ''

  unlockedPathKeyAddr: string = ''

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

  isUnlocked(path?: string, expectedKeyOnThisPath?: string) {
    // If no path or expected key is provided, just check if there is any
    // unlocked path, that's a valid case when retrieving accounts for import.
    if (!path || !expectedKeyOnThisPath) {
      return !!(this.unlockedPath && this.unlockedPathKeyAddr)
    }

    // Make sure it's unlocked with the right path and with the right key,
    // otherwise - treat as not unlocked.
    return this.unlockedPathKeyAddr === expectedKeyOnThisPath && this.unlockedPath === path
  }

  async unlock(path?: ReturnType<typeof getHdPathFromTemplate>, expectedKeyOnThisPath?: string) {
    const pathToUnlock = path || getHdPathFromTemplate(this.hdPathTemplate, 0)

    if (this.isUnlocked(pathToUnlock, expectedKeyOnThisPath)) {
      return 'ALREADY_UNLOCKED'
    }

    try {
      const response = await trezorConnect.ethereumGetAddress({
        path: pathToUnlock,
        showOnTrezor: false
      })

      if (!response.success) {
        throw new Error(response.payload.error || 'Failed to unlock Trezor for unknown reason.')
      }

      this.unlockedPath = response.payload.serializedPath
      this.unlockedPathKeyAddr = response.payload.address

      return 'JUST_UNLOCKED'
    } catch (e: any) {
      throw new Error(e?.message || e?.toString() || 'Failed to unlock Trezor for unknown reason.')
    }
  }
}

export default TrezorController
