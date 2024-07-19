import { Signature, Transaction, TransactionLike } from 'ethers'

import { ExternalKey, KeystoreSigner } from '@ambire-common/interfaces/keystore'
import { normalizeLedgerMessage } from '@ambire-common/libs/ledger/ledger'
import { addHexPrefix } from '@ambire-common/utils/addHexPrefix'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import { stripHexPrefix } from '@ambire-common/utils/stripHexPrefix'
import LedgerController, { ledgerService } from '@web/modules/hardware-wallet/controllers/LedgerController'

class LedgerSigner implements KeystoreSigner {
  key: ExternalKey

  controller: LedgerController | null = null

  constructor(_key: ExternalKey) {
    this.key = _key
  }

  // TODO: the ExternalSignerController type is missing some properties from
  // type 'LedgerController', sync the types mismatch
  // @ts-ignore
  init(externalDeviceController?: LedgerController) {
    if (!externalDeviceController) {
      throw new Error('ledgerSigner: externalDeviceController not initialized')
    }

    this.controller = externalDeviceController
  }

  #prepareForSigning = async () => {
    if (!this.controller) {
      throw new Error(
        'Something went wrong when preparing Ledger to sign. Please try again or contact support if the problem persists.'
      )
    }

    const path = getHdPathFromTemplate(this.key.meta.hdPathTemplate, this.key.meta.index)
    await this.controller.unlock(path, this.key.addr)

    // After unlocking, SDK instance should always be present, double-check here
    if (!this.controller.walletSDK) {
      throw new Error(
        'Something went wrong when preparing Ledger to sign. Please try again or contact support if the problem persists.'
      )
    }

    if (!this.controller.isUnlocked(path, this.key.addr)) {
      throw new Error(
        `The Ledger is unlocked, but with different seed or passphrase, because the address of the retrieved key is different than the key expected (${shortenAddress(
          this.key.addr,
          13
        )})`
      )
    }
  }

  /**
   * This method is designed to handle the scenario where Ledger device loses
   * connectivity during an operation. Without this method, if the Ledger device
   * disconnects, the Ledger SDK hangs indefinitely because the promise
   * associated with the operation never resolves or rejects.
   */
  async #withDisconnectProtection<T>(operation: () => Promise<T>): Promise<T> {
    let listenerCbRef: (...args: Array<any>) => any = () => {}
    const disconnectHandler =
      (reject: (reason?: any) => void) =>
      ({ device }: { device: HIDDevice }) => {
        if (LedgerController.vendorId === device.vendorId)
          reject(new Error('Ledger device got disconnected.'))
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

  async #withNormalizedError<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error: any) {
      throw new Error(normalizeLedgerMessage(error?.message))
    }
  }

  signRawTransaction: KeystoreSigner['signRawTransaction'] = async (txnRequest) => {
    await this.#prepareForSigning()

    // In case `maxFeePerGas` is provided, treat as an EIP-1559 transaction,
    // since there's no other better way to distinguish between the two in here.
    const type = typeof txnRequest.maxFeePerGas === 'bigint' ? 2 : 0

    try {
      const unsignedTxn: TransactionLike = { ...txnRequest, type }

      const unsignedSerializedTxn = Transaction.from(unsignedTxn).unsignedSerialized

      // Look for resolutions for external plugins and ERC20
      const resolution = await ledgerService.resolveTransaction(
        stripHexPrefix(unsignedSerializedTxn),
        this.controller!.walletSDK!.loadConfig,
        {
          externalPlugins: true,
          erc20: true,
          nft: true
        }
      )

      const path = getHdPathFromTemplate(this.key.meta.hdPathTemplate, this.key.meta.index)

      const res = await this.#withDisconnectProtection(() =>
        this.#withNormalizedError(() =>
          this.controller!.walletSDK!.signTransaction(
            path,
            stripHexPrefix(unsignedSerializedTxn),
            resolution
          )
        )
      )

      const signature = Signature.from({
        r: addHexPrefix(res.r),
        s: addHexPrefix(res.s),
        v: Signature.getNormalizedV(addHexPrefix(res.v))
      })
      const signedSerializedTxn = Transaction.from({
        ...unsignedTxn,
        signature
      }).serialized

      return signedSerializedTxn
    } catch (e: any) {
      throw new Error(e?.message || 'ledgerSigner: singing failed for unknown reason')
    }
  }

  signTypedData: KeystoreSigner['signTypedData'] = async ({
    domain,
    types,
    message,
    primaryType
  }) => {
    await this.#prepareForSigning()

    try {
      const path = getHdPathFromTemplate(this.key.meta.hdPathTemplate, this.key.meta.index)
      const rsvRes = await this.#withDisconnectProtection(() =>
        this.#withNormalizedError(() =>
          this.controller!.walletSDK!.signEIP712Message(path, {
            domain,
            types,
            message,
            primaryType
          })
        )
      )

      const signature = addHexPrefix(`${rsvRes.r}${rsvRes.s}${rsvRes.v.toString(16)}`)
      return signature
    } catch (e: any) {
      throw new Error(
        e?.message ||
          'Signing the typed data message failed. Please try again or contact Ambire support if issue persists.'
      )
    }
  }

  signMessage: KeystoreSigner['signMessage'] = async (hex) => {
    if (!stripHexPrefix(hex)) {
      throw new Error(
        'Request for signing an empty message detected. Signing empty messages with Ambire is disallowed.'
      )
    }

    await this.#prepareForSigning()

    try {
      const path = getHdPathFromTemplate(this.key.meta.hdPathTemplate, this.key.meta.index)
      const rsvRes = await this.#withDisconnectProtection(() =>
        this.#withNormalizedError(() =>
          this.controller!.walletSDK!.signPersonalMessage(path, stripHexPrefix(hex))
        )
      )

      const signature = addHexPrefix(`${rsvRes?.r}${rsvRes?.s}${rsvRes?.v.toString(16)}`)
      return signature
    } catch (e: any) {
      throw new Error(
        e?.message ||
          'Signing the message failed. Please try again or contact Ambire support if issue persists.'
      )
    }
  }
}

export default LedgerSigner
