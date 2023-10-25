import { addHexPrefix } from 'ethereumjs-util'
import * as SDK from 'gridplus-sdk'

import { BIP44_LATTICE_TEMPLATE } from '@ambire-common/consts/derivation'
import { ExternalKey, KeystoreSigner } from '@ambire-common/interfaces/keystore'
import { Transaction } from '@ethereumjs/tx'
import { serialize } from '@ethersproject/transactions'
import LatticeController from '@web/modules/hardware-wallet/controllers/LatticeController'

import type { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'

const EIP_155_CONSTANT = 35

class LatticeSigner implements KeystoreSigner {
  key: ExternalKey

  controller: LatticeController | null = null

  constructor(_key: ExternalKey) {
    this.key = _key
  }

  init(_controller: any) {
    this.controller = _controller
  }

  async signRawTransaction(params: any) {
    if (!this.controller) {
      throw new Error('latticeSigner: trezorController not initialized')
    }

    if (!this.key) {
      throw new Error('latticeSigner: key not found')
    }

    await this._onBeforeLatticeRequest()

    const fwVersion = this.controller.sdkSession.getFwVersion()

    const tx = Transaction.fromTxData(params)

    if (fwVersion?.major === 0 && fwVersion?.minor <= 11 && params.type) {
      throw new Error('Please update Lattice firmware.')
    }

    const data: any = {}
    data.payload = this.getLegacyTxReq(tx)
    data.chainId = params.chainId
    data.signerPath = this.controller._getHDPathIndices(BIP44_LATTICE_TEMPLATE, this.key.meta.index)

    const res = await this.controller.sdkSession!.sign({ currency: 'ETH', data })

    if (!res.sig || !res.sig.r || !res.sig.s) {
      throw new Error('latticeSigner: no signature returned')
    }

    let v
    // Construct the `v` signature param
    if (res.sig.v === undefined) {
      // V2 signature needs `v` calculated
      v = SDK.Utils.getV(tx, res)
    } else {
      // Legacy signatures have `v` in the response
      v = res.sig.v.length === 0 ? '0' : res.sig.v.toString('hex')
    }

    const intV = parseInt(v, 16)
    const signedChainId = Math.floor((intV - EIP_155_CONSTANT) / 2)

    if (signedChainId !== params.chainId) {
      throw new Error(`ledgerSigner: invalid returned V 0x${res.sig.v}`)
    }

    const unsignedTxObj = {
      ...params,
      gasLimit: params.gasLimit || params.gas
    }

    delete unsignedTxObj.from
    delete unsignedTxObj.gas
    delete unsignedTxObj.v

    const signature = serialize(unsignedTxObj, {
      r: addHexPrefix(res.sig.r.toString('hex')),
      s: addHexPrefix(res.sig.s.toString('hex')),
      v: intV
    })

    return signature
  }

  async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, any>,
    primaryType?: string
  ) {
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
      throw new Error('latticeSigner: trezorController not initialized')
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
        signerPath: this.controller._getHDPathIndices(BIP44_LATTICE_TEMPLATE, this.key.meta.index)
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
