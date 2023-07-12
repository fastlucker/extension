import { KeystoreSigner } from 'ambire-common/src/interfaces/keystore'
import { Key } from 'ambire-common/src/libs/keystore/keystore'

import type { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'

class LatticeSigner implements KeystoreSigner {
  key: Key

  constructor(_key: Key) {
    this.key = _key
  }

  init() {}

  async signRawTransaction(params: any) {
    return Promise.resolve('')
  }

  async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, any>
  ) {
    return Promise.resolve('')
  }

  async signMessage(hash: string) {
    return Promise.resolve('')
  }
}

export default LatticeSigner
