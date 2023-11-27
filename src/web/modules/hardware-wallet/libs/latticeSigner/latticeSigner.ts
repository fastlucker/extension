import { hexlify, Signature, Transaction, TransactionLike } from 'ethers'
import * as SDK from 'gridplus-sdk'

import { ExternalKey, KeystoreSigner } from '@ambire-common/interfaces/keystore'
import { TypedMessage } from '@ambire-common/interfaces/userRequest'
import { getHDPathIndices } from '@ambire-common/utils/hdPath'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'

// TODO: Remove
// const EIP_155_CONSTANT = 35

class LatticeSigner implements KeystoreSigner {
  key: ExternalKey

  controller: LatticeController | null = null

  constructor(_key: ExternalKey) {
    this.key = _key
  }

  // TODO: the ExternalSignerController type is missing some properties from
  // type 'LedgerController', sync the types mismatch
  // @ts-ignore
  init(externalSignerController?: LatticeController) {
    if (!externalSignerController) {
      throw new Error('ledgerSigner: externalSignerController not initialized')
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

    // TODO: Consider bring back this check when EIP1559 and EIP2930 support is added
    // Lattice firmware v0.11.0 implemented EIP1559 and EIP2930
    // We should throw an error if we cannot support this.
    // const fwVersion = this.controller.sdkSession?.getFwVersion()
    // if (fwVersion?.major === 0 && fwVersion?.minor <= 11 && params.type) {
    //   throw new Error('Please update Lattice firmware.')
    // }

    // TODO: Remove
    // const tx = Transaction.fromTxData(params)
    // const data: any = {}
    // data.payload = this.getLegacyTxReq(tx)
    // data.chainId = params.chainId
    // data.signerPath = getHDPathIndices(this.key.meta.hdPathTemplate, this.key.meta.index)

    const signerPath = getHDPathIndices(this.key.meta.hdPathTemplate, this.key.meta.index)

    const unsignedTxn: TransactionLike = {
      ...txnRequest,
      // TODO: Temporary use the legacy transaction mode, because Ambire
      // extension doesn't support EIP-1559 yet (type: `2`)
      type: 0
    }

    const unsignedSerializedTxn = Transaction.from(unsignedTxn).unsignedSerialized

    // const tx = TransactionFactory.fromTxData(unsignedTxn)
    // Full, serialized EVM transaction
    // const msg = tx.getMessageToSign(false)

    const res = await this.controller.sdkSession!.sign({
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

    // TODO: Remove
    // let v
    // // Construct the `v` signature param
    // if (res.sig.v === undefined) {
    //   // V2 signature needs `v` calculated
    //   v = SDK.Utils.getV(tx, res)
    // } else {
    //   // Legacy signatures have `v` in the response
    //   v = res.sig.v.length === 0 ? '0' : res.sig.v.toString('hex')
    // }

    // const intV = parseInt(v, 16)
    // const signedChainId = Math.floor((intV - EIP_155_CONSTANT) / 2)

    // const unsignedTxObj = {
    //   ...params,
    //   gasLimit: params.gasLimit || params.gas
    // }

    // delete unsignedTxObj.from
    // delete unsignedTxObj.gas
    // delete unsignedTxObj.v

    // const signature = serialize(unsignedTxObj, {
    //   r: addHexPrefix(res.sig.r.toString('hex')),
    //   s: addHexPrefix(res.sig.s.toString('hex')),
    //   v: intV
    // })

    try {
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
      throw new Error(error?.message || 'latticeSigner: singing failed for unknown reason')
    }
  }

  async signTypedData({ domain, types, message, primaryType }: TypedMessage) {
    if (!types.EIP712Domain) {
      throw new Error('latticeSigner: only EIP712 messages are supported')
    }

    return this._signMsgRequest({ domain, types, primaryType, message }, 'eip712')
  }

  async signMessage(hash: string) {
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
      throw new Error('latticeSigner: no signature returned')
    }

    // Convert the `v` to a number. It should convert to 0 or 1
    let v
    try {
      v = res.sig.v.toString('hex')
      if (v.length < 2) {
        v = `0${v}`
      }
    } catch (err) {
      throw new Error('latticeSigner: invalid signature format returned')
    }

    const foundIdx = await this.controller._keyIdxInCurrentWallet(this.key)
    if (foundIdx === null) {
      throw new Error('latticeSigner: key not found in the current Lattice wallet')
    }

    return `0x${res.sig.r}${res.sig.s}${v}`
  }

  async _onBeforeLatticeRequest() {
    const wasUnlocked = this.controller?.isUnlocked()
    await this.controller?.unlock()

    if (wasUnlocked) {
      await this.controller?._connect()
    }
  }

  getLegacyTxReq(tx: any) {
    let txData: any
    try {
      txData = {
        nonce: `0x${tx.nonce.toString('hex')}` || 0,
        gasLimit: `0x${tx.gasLimit.toString('hex')}`,
        to: tx.to ? tx.to.toString('hex') : null, // null for contract deployments
        value: `0x${tx.value.toString('hex')}`,
        data: tx.data.length === 0 ? null : `0x${tx.data.toString('hex')}`
      }
      switch (tx._type) {
        case 2: // eip1559
          if (
            tx.maxPriorityFeePerGas === null ||
            tx.maxFeePerGas === null ||
            tx.maxPriorityFeePerGas === undefined ||
            tx.maxFeePerGas === undefined
          )
            throw new Error(
              '`maxPriorityFeePerGas` and `maxFeePerGas` must be included for EIP1559 transactions.'
            )
          txData.maxPriorityFeePerGas = `0x${tx.maxPriorityFeePerGas.toString('hex')}`
          txData.maxFeePerGas = `0x${tx.maxFeePerGas.toString('hex')}`
          txData.accessList = tx.accessList || []
          txData.type = 2
          break
        case 1: // eip2930
          txData.accessList = tx.accessList || []
          txData.gasPrice = `0x${tx.gasPrice.toString('hex')}`
          txData.type = 1
          break
        default:
          // legacy
          txData.gasPrice = `0x${tx.gasPrice.toString('hex')}`
          txData.type = null
          break
      }
    } catch (err) {
      throw new Error('Failed to build transaction.')
    }
    return txData
  }
}

export default LatticeSigner
