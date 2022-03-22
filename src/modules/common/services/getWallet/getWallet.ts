import { ethers } from 'ethers'

import { ledgerSignMessage, ledgerSignTransaction } from '@modules/hardware-wallet/services/ledger'

const wallets: any = {}

function getWalletNew({ chainId, signer, signerExtra }: any, device: any) {
  if (signerExtra && signerExtra.type === 'ledger') {
    return {
      signMessage: (hash: any) =>
        ledgerSignMessage(ethers.utils.hexlify(hash), signer.address, device),
      signTransaction: (params: any) => ledgerSignTransaction(params, chainId, device)
    }
  }
  // TODO: implement Trezor logic here
  if (signer.one) {
    throw new Error(
      'getWallet not applicable for QuickAccounts: use primaryKeyBackup with the passphrase and /second-sig'
    )
  } else {
    throw new Error('unknown signer type')
  }
}

export function getWallet({ signer, signerExtra, chainId }: any, device: any) {
  const id = `${signer.address || signer.one}${chainId}`
  if (wallets[id]) return wallets[id]
  // eslint-disable-next-line no-return-assign
  return (wallets[id] = getWalletNew({ signer, signerExtra, chainId }, device))
}
