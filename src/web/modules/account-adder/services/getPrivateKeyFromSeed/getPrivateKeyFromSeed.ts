import { HDNodeWallet, Mnemonic } from 'ethers'

import { HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import { getHdPathFromTemplate } from '@ambire-common/utils/hdPath'

const getPrivateKeyFromSeed = (
  seed: string,
  keyIndex: number,
  hdPathTemplate: HD_PATH_TEMPLATE_TYPE
) => {
  const mnemonic = Mnemonic.fromPhrase(seed)
  const wallet = HDNodeWallet.fromMnemonic(
    mnemonic,
    getHdPathFromTemplate(hdPathTemplate, keyIndex)
  )
  if (wallet) {
    return wallet.privateKey
  }

  throw new Error('Getting the private key from the seed phrase failed.')
}

export default getPrivateKeyFromSeed
