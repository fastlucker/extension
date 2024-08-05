import {
  BIP44_STANDARD_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { ExternalSignerController } from '@ambire-common/interfaces/keystore'
import { getMessageFromTrezorErrorCode } from '@ambire-common/libs/trezor/trezor'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import trezorConnect, { TrezorConnect } from '@trezor/connect-webextension'

export type {
  EthereumTransaction,
  EthereumTransactionEIP1559,
  TrezorConnect
} from '@trezor/connect-webextension'

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

  walletSDK: TrezorConnect = trezorConnect

  // Trezor SDK gets initiated once (upon extension start) and never unloaded
  isInitiated = false

  // Holds the initial load promise, so that one can wait until it completes
  initialLoadPromise

  constructor() {
    // TODO: Handle different derivation
    this.hdPathTemplate = BIP44_STANDARD_DERIVATION_TEMPLATE

    this.walletSDK.on('DEVICE_EVENT', (event: any) => {
      if (event?.payload?.features?.model) {
        this.deviceModel = event.payload.features.model
      }
      // The device ID could be retrieved from both places
      if (event?.payload?.features?.device_id || event?.payload?.id) {
        this.deviceId = event.payload.features.device_id || event.payload.id
      }
    })

    this.initialLoadPromise = this.#init()
  }

  async #init() {
    try {
      await this.walletSDK.init({ manifest: TREZOR_CONNECT_MANIFEST, lazyLoad: true, popup: true })
      this.isInitiated = true
    } catch (error) {
      console.error('TrezorController: failed to init the Trezor SDK', error)
    }
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

    const response = await this.walletSDK.ethereumGetAddress({
      path: pathToUnlock,
      // Do not use this validation option, because if the expected key is not
      // on this path, the Trezor displays a not very user friendly error
      // "Addresses do not match" in the Trezor popup. That might cause
      // confusion. And we can't display a better message until the user
      // closes the Trezor popup and we get the response from the Trezor.
      // address: expectedKeyOnThisPath,
      showOnTrezor: false // prioritize having less steps for the user
    })

    if (!response.success) {
      throw new Error(getMessageFromTrezorErrorCode(response.payload.code, response.payload.error))
    }

    this.unlockedPath = response.payload.serializedPath
    this.unlockedPathKeyAddr = response.payload.address

    return 'JUST_UNLOCKED'
  }
}

export default TrezorController
