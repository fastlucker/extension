import { HDNodeWallet, Mnemonic } from 'ethers'

import { BIP44_HD_PATH } from '@web/modules/hardware-wallet/constants/hdPaths'

const getPrivateKeyFromSeed = (
  seed: string,
  keyIndex: number,
  derivationPath: string = BIP44_HD_PATH
) => {
  const mnemonic = Mnemonic.fromPhrase(seed)
  const wallet = HDNodeWallet.fromMnemonic(mnemonic)
  const keyObj = wallet.derivePath(`${derivationPath}/${keyIndex}`)
  if (keyObj) {
    return keyObj.privateKey
  }

  throw new Error('get privateKey from Wallet failed')
}

export default getPrivateKeyFromSeed
