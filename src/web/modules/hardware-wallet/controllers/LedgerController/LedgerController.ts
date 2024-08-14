import {
  BIP44_LEDGER_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { ExternalSignerController } from '@ambire-common/interfaces/keystore'
import {
  normalizeLedgerMessage,
  withLedgerTimeoutProtection
} from '@ambire-common/libs/ledger/ledger'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import { ledgerUSBVendorId } from '@ledgerhq/devices'
import Eth, { ledgerService } from '@ledgerhq/hw-app-eth'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'

class LedgerController implements ExternalSignerController {
  hdPathTemplate: HD_PATH_TEMPLATE_TYPE

  unlockedPath: string = ''

  unlockedPathKeyAddr: string = ''

  isWebHID: boolean

  transport: TransportWebHID | null

  walletSDK: null | Eth

  type = 'ledger'

  deviceModel = 'unknown'

  deviceId = ''

  static vendorId = ledgerUSBVendorId

  constructor() {
    // TODO: make it optional (by default should be false and set it to true only when there is ledger connected via usb)
    this.isWebHID = true
    this.transport = null
    this.walletSDK = null
    // TODO: Handle different derivation
    this.hdPathTemplate = BIP44_LEDGER_DERIVATION_TEMPLATE

    // When the `cleanUpListener` method gets passed to the navigator.hid listeners
    // the `this` context gets lost, so we need to bind it here. The `this` context
    // in the `cleanUp` method should be the `LedgerController` instance.
    this.cleanUpListener = this.cleanUpListener.bind(this)
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

  /**
   * Checks if WebUSB transport is supported by the browser. Does not work in the
   * service worker (background) in manifest v3, because it needs a `window` ref.
   */
  static isSupported = TransportWebHID.isSupported

  /**
   * Checks if at least one Ledger device is connected.
   */
  static isConnected = async () => {
    const devices = await navigator.hid.getDevices()
    return devices.filter((device) => device.vendorId === LedgerController.vendorId).length > 0
  }

  /**
   * Grant permission to the extension service worker to access an HID device.
   * Should be called only from the foreground and it requires a user gesture
   * to open the device selection prompt (click on a button, etc.).
   */
  static grantDevicePermissionIfNeeded = async () => {
    // If a device is already connected and permission is granted, no need to
    // reselect it again. The service worker than can access the device.
    if (await LedgerController.isConnected()) return

    const filters = [{ vendorId: LedgerController.vendorId }]
    const devices = await navigator.hid.requestDevice({ filters })

    if (devices.length === 0) throw new Error('Ledger device connection request was canceled.')

    const device = devices[0]
    await device.open()
  }

  /**
   * The Ledger device requires a new SDK instance (session) every time the
   * device is connected (after being disconnected). This method checks if there
   * is an existing SDK instance and creates a new one if needed.
   */
  async #initSDKSessionIfNeeded() {
    const isConnected = await LedgerController.isConnected()
    if (!isConnected) throw new Error("Ledger is not connected. Please make sure it's plugged in.")

    if (this.walletSDK) return

    try {
      // @ts-ignore types mismatch, not sure why
      this.transport = await TransportWebHID.create()
      if (!this.transport) throw new Error('Transport failed to get initialized')
      navigator.hid.addEventListener('disconnect', this.cleanUpListener)

      this.walletSDK = new Eth(this.transport)

      // Transport is glitchy and its types mismatch, so overprotect by optional chaining
      this.deviceModel = this.transport.deviceModel?.id || 'unknown'
      this.deviceId = this.transport.device?.productId?.toString() || ''
    } catch (e: any) {
      throw new Error(normalizeLedgerMessage(e?.message))
    }
  }

  async unlock(path?: ReturnType<typeof getHdPathFromTemplate>, expectedKeyOnThisPath?: string) {
    const pathToUnlock = path || getHdPathFromTemplate(this.hdPathTemplate, 0)
    await this.#initSDKSessionIfNeeded()

    if (this.isUnlocked(pathToUnlock, expectedKeyOnThisPath)) {
      return 'ALREADY_UNLOCKED'
    }

    if (!this.isWebHID) {
      throw new Error(
        'Ledger only supports USB connection between Ambire and your device. Please connect your device via USB.'
      )
    }

    if (!this.walletSDK) {
      throw new Error(normalizeLedgerMessage()) // no message, indicating no connection
    }

    try {
      const response = await this.walletSDK.getAddress(
        pathToUnlock,
        false // prioritize having less steps for the user
      )
      this.unlockedPath = pathToUnlock
      this.unlockedPathKeyAddr = response.address

      return 'JUST_UNLOCKED'
    } catch (error: any) {
      throw new Error(normalizeLedgerMessage(error?.message))
    }
  }

  async retrieveAddresses(paths: string[]) {
    await this.#initSDKSessionIfNeeded()

    if (!this.walletSDK) {
      throw new Error(normalizeLedgerMessage()) // no message, indicating no connection
    }

    const keys: string[] = []
    let latestGetAddressError: Error | undefined
    for (let i = 0; i < paths.length; i++) {
      try {
        // Purposely await in loop to avoid sending multiple requests at once.
        // Send them 1 by 1, the Ledger device can't handle them in parallel,
        // it throws a "device busy" error.
        // eslint-disable-next-line no-await-in-loop
        const key = await withLedgerTimeoutProtection(() =>
          this.walletSDK!.getAddress(
            paths[i],
            false, // no need to show on display
            false // no need for the chain code
          )
        )

        if (key) keys.push(key.address)
      } catch (e: any) {
        latestGetAddressError = e
      }
    }

    // Corner-case: if user interacts with Ambire, then interacts with another
    // wallet app (installed on the computer or a web app) and then comes back
    // to Ambire, the Ledger device might not respond to all requests. Therefore
    // we might receive only some of the keys, but not all of them.
    // To reproduce: 1. Plug in and unlock Ledger, open Ambire, import accounts;
    // 2. Now switch to Ledger Live and connect (My Ledger); 3. Switch back to
    // Ambire and try importing accounts again.
    const notAllKeysGotRetrieved = keys.length !== paths.length
    if (notAllKeysGotRetrieved) {
      throw new Error(normalizeLedgerMessage(latestGetAddressError?.message))
    }

    return keys
  }

  cleanUp = async () => {
    if (!this.walletSDK) return

    this.walletSDK = null
    this.unlockedPath = ''
    this.unlockedPathKeyAddr = ''

    navigator.hid.removeEventListener('disconnect', this.cleanUpListener)

    try {
      // Might fail if the transport was already closed, which is fine.
      await this.transport?.close()
    } finally {
      this.transport = null
    }
  }

  async cleanUpListener({ device }: { device: HIDDevice }) {
    if (device.vendorId === LedgerController.vendorId) await this.cleanUp()
  }
}

export { Eth, ledgerService }
export default LedgerController
