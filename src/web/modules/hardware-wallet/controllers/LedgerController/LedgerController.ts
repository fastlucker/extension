import {
  BIP44_LEDGER_DERIVATION_TEMPLATE,
  HD_PATH_TEMPLATE_TYPE
} from '@ambire-common/consts/derivation'
import { ExternalSignerController } from '@ambire-common/interfaces/keystore'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import Eth, { ledgerService } from '@ledgerhq/hw-app-eth'
import Transport from '@ledgerhq/hw-transport'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'

class LedgerController implements ExternalSignerController {
  hdPathTemplate: HD_PATH_TEMPLATE_TYPE

  unlockedPath: string = ''

  unlockedPathKeyAddr: string = ''

  isWebHID: boolean

  transport: Transport | null

  walletSDK: null | Eth

  type = 'ledger'

  deviceModel = 'unknown'

  deviceId = ''

  constructor() {
    // TODO: make it optional (by default should be false and set it to true only when there is ledger connected via usb)
    this.isWebHID = true
    this.transport = null
    this.walletSDK = null
    // TODO: Handle different derivation
    this.hdPathTemplate = BIP44_LEDGER_DERIVATION_TEMPLATE

    // When the `cleanUp` method gets passed to the `this.transport.on` and
    // "this.transport.off" methods, the `this` context gets lost, so we need
    // to bind it here. The `this` context in the `cleanUp` method should be
    // the `LedgerController` instance. Not sure why this happens, since the
    // `cleanUp` method is an arrow function and should have the `this` context
    // of the `LedgerController` instance by default.
    this.cleanUp = this.cleanUp.bind(this)
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
   * The Ledger device requires a new SDK instance (session) every time the
   * device is connected (after being disconnected). This method checks if there
   * is an existing SDK instance and creates a new one if needed.
   */
  async initSDKSessionIfNeeded() {
    if (this.walletSDK) return

    const isSupported = await TransportWebHID.isSupported()
    if (!isSupported) {
      throw new Error(
        'Can not establish connection with your Ledger device. Your browser does not support WebHID. Please use a different browser.'
      )
    }

    try {
      // @ts-ignore types mismatch, not sure why
      this.transport = await TransportWebHID.create()
      if (!this.transport) throw new Error('Transport failed to get initialized')

      this.transport.on('disconnect', this.cleanUp)

      this.walletSDK = new Eth(this.transport)

      if (this.transport.deviceModel?.id) {
        this.deviceModel = this.transport.deviceModel.id
      }
      // @ts-ignore missing or bad type, but the `device` is in there
      if (this.transport?.device?.productId) {
        // @ts-ignore missing or bad type, but the `device` is in there
        this.deviceId = this.transport.device.productId.toString()
      }
    } catch (e: any) {
      throw new Error(
        'Could not establish connection with your Ledger device. Please make sure it is connected via USB.'
      )
    }
  }

  async unlock(path?: ReturnType<typeof getHdPathFromTemplate>, expectedKeyOnThisPath?: string) {
    const pathToUnlock = path || getHdPathFromTemplate(this.hdPathTemplate, 0)
    await this.initSDKSessionIfNeeded()

    if (this.isUnlocked(pathToUnlock, expectedKeyOnThisPath)) {
      return 'ALREADY_UNLOCKED'
    }

    if (!this.isWebHID) {
      throw new Error(
        'Ledger only supports USB connection between Ambire and your device. Please connect your device via USB.'
      )
    }

    if (!this.walletSDK) {
      throw new Error(
        'Could not establish connection with your Ledger device. Please make sure it is connected via USB.'
      )
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
      const message = error?.message || error?.toString() || 'Ledger device: no response.'

      throw new Error(
        `Could not connect to your Ledger device. Please make sure it is connected, unlocked and running the Ethereum app. \n${message}`
      )
    }
  }

  cleanUp = async () => {
    this.walletSDK = null
    this.unlockedPath = ''
    this.unlockedPathKeyAddr = ''

    try {
      if (this.transport) {
        this.transport.off('disconnect', this.cleanUp)

        // For some reason, calling the `close` method on the transport causes
        // something in the transport instance to get stuck or crash
        // and this doesn't even gets counted as an error, so the catch block
        // never gets executed. So we just set the transport to null here,
        // which works just fine and doesn't cause any issues.
        // await this.transport.close()
        this.transport = null
      }
    } catch {
      // Fail silently
    }
  }
}

export { Eth, ledgerService }
export default LedgerController
