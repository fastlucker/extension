import { HDNodeWallet, Mnemonic } from 'ethers'

const getPrivateKeyFromSeed = (
  seed: string,
  keyIndex: number,
  derivationPath: string = "m/44'/60'/0'"
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
