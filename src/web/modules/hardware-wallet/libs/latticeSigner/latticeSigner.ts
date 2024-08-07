import { hexlify, Signature, Transaction, TransactionLike } from 'ethers'
import * as SDK from 'gridplus-sdk'

import { ExternalKey, KeystoreSigner } from '@ambire-common/interfaces/keystore'
import { addHexPrefix } from '@ambire-common/utils/addHexPrefix'
import { getHDPathIndices } from '@ambire-common/utils/hdPath'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'

class LatticeSigner implements KeystoreSigner {
  key: ExternalKey

  controller: LatticeController | null = null

  constructor(_key: ExternalKey) {
    this.key = _key
  }

  // TODO: the ExternalSignerController type is missing some properties from
  // type 'LatticeController', sync the types mismatch
  // @ts-ignore
  init(externalSignerController?: LatticeController) {
    if (!externalSignerController) {
      throw new Error('latticeSigner: externalSignerController not initialized')
    }

    this.controller = externalSignerController
  }

  signRawTransaction: KeystoreSigner['signRawTransaction'] = async (txnRequest) => {
    if (!this.controller) {
      throw new Error(
        'Something went wrong with triggering the sign message mechanism. Please try again or contact support if the problem persists.'
      )
    }

    await this._onBeforeLatticeRequest()

    if (!this.controller.sdkSession) {
      throw new Error(
        'Something went wrong with initiating a session with the device. Please try again or contact support if the problem persists.'
      )
    }

    // EIP1559 and EIP2930 support was added to Lattice in firmware v0.11.0,
    // "general signing" was introduced in v0.14.0. In order to avoid supporting
    // legacy firmware, throw an error and prompt user to update.
    const fwVersion = this.controller.sdkSession.getFwVersion()
    if (fwVersion?.major === 0 && fwVersion?.minor <= 14) {
      throw new Error('Please update Lattice1 firmware.')
    }

    try {
      const signerPath = getHDPathIndices(this.key.meta.hdPathTemplate, this.key.meta.index)
      // In case `maxFeePerGas` is provided, treat as an EIP-1559 transaction,
      // since there's no other better way to distinguish between the two in here.
      const type = typeof txnRequest.maxFeePerGas === 'bigint' ? 2 : 0
      const unsignedTxn: TransactionLike = { ...txnRequest, type }

      const unsignedSerializedTxn = Transaction.from(unsignedTxn).unsignedSerialized

      const res = await this.controller.sdkSession.sign({
        // Prior to general signing, request data was sent to the device in
        // preformatted ways and was used to build the transaction in firmware.
        // GridPlus are phasing out this mechanism, for signing raw transactions
        // flip to using the "general signing" mechanism, instead of the legacy
        // one that was getting triggered by passing `currency: 'ETH'` flag.
        data: {
          signerPath,
          payload: unsignedSerializedTxn,
          curveType: SDK.Constants.SIGNING.CURVES.SECP256K1,
          hashType: SDK.Constants.SIGNING.HASHES.KECCAK256,
          encodingType: SDK.Constants.SIGNING.ENCODINGS.EVM
        }
      })

      // Ensure we got a signature back
      if (!res?.sig || !res.sig.r || !res.sig.s || !res.sig.v) {
        throw new Error('latticeSigner: no signature returned')
      }

      // GridPlus SDK's type for the signature is any, either because of bad
      // types, either because of bad typescript import/export configuration.
      type MissingSignatureType = {
        v: Uint8Array
        r: Uint8Array
        s: Uint8Array
      }
      const { r, s, v } = res.sig as MissingSignatureType

      const signature = Signature.from({
        r: hexlify(r),
        s: hexlify(s),
        v: Signature.getNormalizedV(hexlify(v))
      })
      const signedSerializedTxn = Transaction.from({
        ...unsignedTxn,
        signature
      }).serialized

      return signedSerializedTxn
    } catch (error: any) {
      throw new Error(
        // An `error.err` message might come from the Lattice .sign() failure
        error?.message || error?.err || 'latticeSigner: singing failed for unknown reason'
      )
    }
  }

  signTypedData: KeystoreSigner['signTypedData'] = async ({
    domain,
    types,
    message,
    primaryType
  }) => {
    if (!types.EIP712Domain) {
      throw new Error('latticeSigner: only EIP712 messages are supported')
    }

    return this._signMsgRequest({ domain, types, primaryType, message }, 'eip712')
  }

  signMessage: KeystoreSigner['signMessage'] = async (hash) => {
    return this._signMsgRequest(hash, 'signPersonal')
  }

  async _signMsgRequest(payload: any, protocol: 'signPersonal' | 'eip712') {
    if (!this.controller) {
      throw new Error(
        'Something went wrong with triggering the sign message mechanism. Please try again or contact support if the problem persists.'
      )
    }

    if (!this.key) {
      throw new Error('latticeSigner: key not found')
    }

    await this._onBeforeLatticeRequest()

    const req = {
      currency: 'ETH_MSG',
      data: {
        protocol,
        payload,
        signerPath: getHDPathIndices(this.key.meta.hdPathTemplate, this.key.meta.index)
      }
    }

    const res = await this.controller.sdkSession!.sign(req)

    if (!res.sig) {
      throw new Error(
        'Required signature data was found missing. Please try again later or contact Ambire support.'
      )
    }

    const foundIdx = await this.controller._keyIdxInCurrentWallet(this.key)
    if (foundIdx === null) {
      throw new Error(
        `The key you signed with is different than the key we expected (${shortenAddress(
          this.key.addr,
          13
        )}). You likely have different active wallet on your Lattice1 device.`
      )
    }

    return addHexPrefix(`${res.sig.r}${res.sig.s}${res.sig.v.toString('hex')}`)
  }

  async _onBeforeLatticeRequest() {
    const wasUnlocked = this.controller?.isUnlocked()
    await this.controller?.unlock()

    if (wasUnlocked) {
      await this.controller?._connect()
    }
  }
}

export default LatticeSigner
