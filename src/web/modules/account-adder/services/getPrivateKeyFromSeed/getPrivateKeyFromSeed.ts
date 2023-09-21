import { BIP44_HD_PATH } from 'ambire-common/src/consts/derivation'
import { HDNodeWallet, Mnemonic } from 'ethers'

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

  throw new Error('Getting the private key from the seed phrase failed.')
}

export default getPrivateKeyFromSeed
