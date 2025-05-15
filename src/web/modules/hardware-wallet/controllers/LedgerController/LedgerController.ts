import * as sigUtil from 'eth-sig-util'

import ExternalSignerError from '@ambire-common/classes/ExternalSignerError'
import { ExternalSignerController } from '@ambire-common/interfaces/keystore'
import { TypedMessage } from '@ambire-common/interfaces/userRequest'
import { normalizeLedgerMessage } from '@ambire-common/libs/ledger/ledger'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import { ContextModuleBuilder } from '@ledgerhq/context-module'
import {
  DeviceManagementKit,
  DeviceManagementKitBuilder,
  DeviceModelId as LedgerDeviceModels,
  LEDGER_VENDOR_ID
} from '@ledgerhq/device-management-kit'
import { DefaultSignerEth } from '@ledgerhq/device-signer-kit-ethereum/lib/types/internal/DefaultSignerEth'
import { webHidTransportFactory } from '@ledgerhq/device-transport-kit-web-hid'

export { LedgerDeviceModels }

const TIMEOUT_FOR_RETRIEVING_FROM_LEDGER = 5000

// FIXME: Importing the SignerEthBuilder class statically fails in the service worker
// somewhere in the rpcFlow, but I'm not sure where exactly (error gets swallowed).
// The only working solution I found is to use dynamic import.
const getSignerBuilder = async () => {
  try {
    // Use dynamic import to avoid the static import issue
    const module = await import('@ledgerhq/device-signer-kit-ethereum')
    return module.SignerEthBuilder
  } catch (error) {
    console.error('Failed to load SignerEthBuilder:', error)
    // Return null or a mock implementation if needed
    return null
  }
}

class LedgerController implements ExternalSignerController {
  unlockedPath: string = ''

  unlockedPathKeyAddr: string = ''

  isWebHID: boolean

  // TODO: Missing type
  transport: any

  signerEth: DefaultSignerEth | null = null

  // TODO: Missing type
  walletSDK: DeviceManagementKit | null

  type = 'ledger'

  deviceModel: LedgerDeviceModels | 'unknown' = 'unknown'

  deviceId = ''

  // TODO: missing type
  discoverySubscription: any

  // TODO: missing type
  stateSubscription: any

  // TODO: missing type
  currentSessionId: any

  static vendorId = LEDGER_VENDOR_ID

  constructor() {
    this.isWebHID = true
    this.transport = null
    this.walletSDK = null

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
  // TODO: Temporarily
  // static isSupported = WebHIDTransport.isSupported
  static isSupported = () => true

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

    const dmk = new DeviceManagementKitBuilder()
      // .addLogger(new ConsoleLogger()) // for debugging only
      .addTransport(webHidTransportFactory)
      .build()

    return new Promise((resolve, reject) => {
      // Start discovering - this will scan for any connected devices
      const discoverySubscription = dmk.startDiscovering({}).subscribe({
        next: async (device) => {
          discoverySubscription.unsubscribe()
          dmk.close()
          resolve(device)
        },
        error: (error) => reject(new ExternalSignerError(normalizeLedgerMessage(error?.message)))
      })
    })
  }

  /**
   * This function is designed to handle the scenario where Ledger device loses
   * connectivity during an operation. Without this method, if the Ledger device
   * disconnects, the Ledger SDK hangs indefinitely because the promise
   * associated with the operation never resolves or rejects.
   */
  static withDisconnectProtection = async <T>(operation: () => Promise<T>): Promise<T> => {
    let listenerCbRef: (...args: Array<any>) => any = () => {}
    const disconnectHandler =
      (reject: (reason?: any) => void) =>
      ({ device }: { device: HIDDevice }) => {
        if (LedgerController.vendorId === device.vendorId) {
          reject(new ExternalSignerError('Ledger device got disconnected.'))
        }
      }

    try {
      // Race the operation against a new Promise that rejects if a 'disconnect'
      // event is emitted from the Ledger device. If the device disconnects
      // before the operation completes, the new Promise rejects and the method
      // returns, preventing the SDK from hanging. If the operation completes
      // before the device disconnects, the result of the operation is returned.
      const result = await Promise.race<T>([
        operation(),
        new Promise((_, reject) => {
          listenerCbRef = disconnectHandler(reject)
          navigator.hid.addEventListener('disconnect', listenerCbRef)
        })
      ])

      return result
    } finally {
      // In either case, the 'disconnect' event listener should be removed
      // after the operation to clean up resources.
      if (listenerCbRef) navigator.hid.removeEventListener('disconnect', listenerCbRef)
    }
  }

  /**
   * Handles the scenario where Ledger device hangs indefinitely during an
   * operation. Happens in some cases when the Ledger device gets connected to
   * Ambire, then another app is accessing the Ledger device and then user comes
   * back to Ambire (without unplug-plugging the Ledger).
   */
  static withTimeoutProtection = async <T>(operation: () => Promise<T>): Promise<T> => {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        const message =
          'Could not connect to your Ledger device for an extended period. Please close any other apps that may be accessing your Ledger device (including wallet apps on your computer and web apps). Ensure your Ledger is responsive. Unplug and plug it again.'
        reject(new ExternalSignerError(message))
      }, TIMEOUT_FOR_RETRIEVING_FROM_LEDGER)
    })

    return Promise.race([operation(), timeout])
  }

  /**
   * The Ledger device requires a new SDK instance (session) every time the
   * device is connected (after being disconnected). This method checks if there
   * is an existing SDK instance and creates a new one if needed.
   */
  async #initSDKSessionIfNeeded() {
    // const isConnected = await LedgerController.isConnected()
    // if (!isConnected)
    //   throw new ExternalSignerError("Ledger is not connected. Please make sure it's plugged in.")

    if (this.walletSDK) return

    try {
      this.walletSDK = new DeviceManagementKitBuilder()
        // .addLogger(new ConsoleLogger()) // for debugging only
        .addTransport(webHidTransportFactory)
        .build()
    } catch (e: any) {
      throw new ExternalSignerError(normalizeLedgerMessage(e?.message))
    }
  }

  async unlock(
    path: ReturnType<typeof getHdPathFromTemplate>,
    expectedKeyOnThisPath?: string,
    shouldOpenLatticeConnectorInTab?: boolean
  ): Promise<'ALREADY_UNLOCKED' | 'JUST_UNLOCKED'> {
    await this.#initSDKSessionIfNeeded()

    if (this.isUnlocked(path, expectedKeyOnThisPath)) {
      return 'ALREADY_UNLOCKED'
    }

    if (!this.isWebHID) {
      throw new ExternalSignerError(
        'Ledger only supports USB connection between Ambire and your device. Please connect your device via USB.'
      )
    }

    if (!this.walletSDK) {
      throw new ExternalSignerError(normalizeLedgerMessage()) // no message, indicating no connection
    }

    // TODO: Check if disconnect protection is still needed with the new SDK
    return LedgerController.withDisconnectProtection(async () => {
      try {
        // Find available devices
        let device: any = null
        await new Promise<void>((resolve, reject) => {
          const discoverySubscription = this.walletSDK!.listenToAvailableDevices({}).subscribe({
            next: (devices) => {
              if (devices && devices.length) {
                device = devices[0]
                discoverySubscription.unsubscribe()
                resolve()
              }
            },
            error: (error) => {
              discoverySubscription.unsubscribe()
              reject(new ExternalSignerError(normalizeLedgerMessage(error?.message)))
            }
          })
        })

        if (!device) {
          throw new ExternalSignerError('No Ledger device detected.')
        }

        // Connect to device
        const walletSDK = this.walletSDK as DeviceManagementKit
        const sessionId = await walletSDK.connect({ device })

        // Get device information
        const connectedDevice = walletSDK.getConnectedDevice({ sessionId })
        this.deviceModel = connectedDevice.modelId
        this.deviceId = connectedDevice.id

        // Get the SignerEthBuilder dynamically to avoid the static import issue
        const SignerEthBuilder = await getSignerBuilder()

        if (!SignerEthBuilder) {
          // Fallback if dynamic import fails
          this.unlockedPath = path
          this.unlockedPathKeyAddr = expectedKeyOnThisPath || ''
          return 'JUST_UNLOCKED' as const
        }

        // Create the signer using the dynamically imported constructor
        const contextModule = new ContextModuleBuilder({ originToken: 'ambire' }).build()
        const signerEth = new SignerEthBuilder({ dmk: walletSDK, sessionId })
          .withContextModule(contextModule)
          .build()

        // Get address
        const hdPath = getHdPathFromTemplate(path as any, 0)
        const hdPathWithoutRoot = hdPath.slice(2)

        const address = await new Promise<string>((resolve, reject) => {
          const { observable } = signerEth.getAddress(hdPathWithoutRoot, {
            checkOnDevice: false,
            returnChainCode: false
          })

          const addressSubscription = observable.subscribe({
            next: (response) => {
              if (response.status === 'completed' && response?.output?.address) {
                addressSubscription.unsubscribe()
                resolve(response.output.address)
              }
            },
            error: (error) => {
              addressSubscription.unsubscribe()
              reject(new ExternalSignerError(normalizeLedgerMessage(error?.message)))
            }
          })
        })

        // Save unlocked state
        this.unlockedPath = path
        this.unlockedPathKeyAddr = address
        this.signerEth = signerEth

        return 'JUST_UNLOCKED' as const
      } catch (error: any) {
        throw new ExternalSignerError(normalizeLedgerMessage(error?.message))
      }
    })
  }

  async retrieveAddresses(paths: string[]) {
    return LedgerController.withDisconnectProtection(async () => {
      await this.#initSDKSessionIfNeeded()

      if (!this.walletSDK || !this.signerEth) {
        throw new ExternalSignerError(normalizeLedgerMessage())
      }

      const keys: string[] = []
      let latestGetAddressError: ExternalSignerError | undefined

      for (let i = 0; i < paths.length; i++) {
        try {
          // Purposely await in loop to avoid sending multiple requests at once.
          // Send them 1 by 1, the Ledger device can't handle them in parallel,
          // it throws a "device busy" error.
          const hdPath = getHdPathFromTemplate(paths[i] as any, 0)
          const hdPathWithoutRoot = hdPath.slice(2)

          // eslint-disable-next-line no-await-in-loop
          const key = await new Promise<string>((resolve, reject) => {
            const { observable } = this.signerEth!.getAddress(hdPathWithoutRoot, {
              checkOnDevice: false, // no need to show on display
              returnChainCode: false
            })

            let addressSubscription: any = null
            addressSubscription = observable.subscribe({
              next: (response: any) => {
                if (response.status !== 'completed') return

                if (response?.output?.address) {
                  addressSubscription?.unsubscribe()
                  resolve(response.output.address)
                } else {
                  addressSubscription?.unsubscribe()
                  reject(new ExternalSignerError('Failed to get address from Ledger device'))
                }
              },
              error: (error) => {
                addressSubscription?.unsubscribe()
                reject(new ExternalSignerError(normalizeLedgerMessage(error?.message)))
              }
            })
          })

          keys.push(key)
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
        throw new ExternalSignerError(normalizeLedgerMessage(latestGetAddressError?.message))
      }

      return keys
    })
  }

  async signPersonalMessage(path: string, messageHex: string) {
    await this.#initSDKSessionIfNeeded()

    if (!this.walletSDK || !this.signerEth) {
      throw new ExternalSignerError(normalizeLedgerMessage())
    }

    // Store reference to signerEth to avoid this context issues
    const signerEth = this.signerEth

    const hdPath = getHdPathFromTemplate(path as any, 0)
    const hdPathWithoutRoot = hdPath.slice(2)

    return new Promise<{ v: number; s: string; r: string }>((resolve, reject) => {
      // FIXME: Message HEX is not readable on the device, converting it to text breaks the signature
      const { observable } = signerEth.signMessage(hdPathWithoutRoot, messageHex)

      let subscription: any = null
      subscription = observable.subscribe({
        next: (response: any) => {
          if (response.status !== 'completed') return

          if (response?.output) {
            subscription?.unsubscribe()
            resolve(response.output)
          } else {
            subscription?.unsubscribe()
            reject(new ExternalSignerError('Failed to sign message with Ledger device'))
          }
        },
        error: (error: any) => {
          subscription?.unsubscribe()
          reject(new ExternalSignerError(normalizeLedgerMessage(error?.message)))
        }
      })
    })
  }

  /**
   * Attempts to sign an EIP-712 message using the Ledger device. If the device
   * does not support direct (clear) EIP-712 signing, it falls back to signing
   * hashes of the message (that works across all Ledger devices).
   */
  signEIP712MessageWithHashFallback = async ({
    path,
    signTypedData: { domain, types, message, primaryType }
  }: {
    path: string
    signTypedData: TypedMessage
  }) => {
    let res: { v: number; s: string; r: string }
    try {
      res = await this.walletSDK!.signEIP712Message(path, {
        domain,
        types,
        message,
        primaryType
      })
    } catch {
      // NOT all Ledger devices support clear signing EIP-721 message (via
      // `signEIP712Message`), example: Ledger Nano S. The alternative is signing
      // hashes - that works across all Ledger devices.
      const domainSeparatorHex = sigUtil.TypedDataUtils.hashStruct(
        'EIP712Domain',
        domain as any,
        types,
        true
      ).toString('hex')
      const hashStructMessageHex = sigUtil.TypedDataUtils.hashStruct(
        primaryType,
        message as any,
        types,
        true
      ).toString('hex')

      res = await this.walletSDK!.signEIP712HashedMessage(
        path,
        domainSeparatorHex,
        hashStructMessageHex
      )
    }

    if (!res)
      throw new ExternalSignerError(
        'Your Ledger device returned an empty signature, which is unexpected. Please try signing again.'
      )

    return res
  }

  // FIXME: This is not ideal.
  cleanUp = async () => {
    // Unsubscribe from all observables
    if (this.discoverySubscription) {
      this.discoverySubscription.unsubscribe()
      this.discoverySubscription = null
    }

    this.walletSDK = null
    this.signerEth = null
    this.unlockedPath = ''
    this.unlockedPathKeyAddr = ''

    navigator.hid.removeEventListener('disconnect', this.cleanUpListener)

    // try {
    //   // Might hang! If user interacts with Ambire, then interacts with another
    //   // wallet app (installed on the computer or a web app) and then comes back
    //   // to Ambire, closing the current transport hangs indefinitely.
    //   await Promise.race([
    //     // Might fail if the transport was already closed, which is fine.
    //     this.transport?.close(),
    //     new Promise((_, reject) => {
    //       const message = normalizeLedgerMessage('No response received from the Ledger device.')
    //       setTimeout(() => reject(message), 3000)
    //     })
    //   ])
    // } finally {
    //   this.transport = null
    // }
  }

  async cleanUpListener({ device }: { device: HIDDevice }) {
    if (device.vendorId === LedgerController.vendorId) await this.cleanUp()
  }
}

export default LedgerController
