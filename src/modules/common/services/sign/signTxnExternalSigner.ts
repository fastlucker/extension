import { Wallet } from 'ethers'

import CONFIG from '@config/env'
import { sendNoRelayer } from '@modules/common/services/sendNoRelayer'

const relayerURL = CONFIG.RELAYER_URL

type Props = {
  privateKey: string
  finalBundle: any
  estimation: any
  feeSpeed: any
  account: any
  network: any
  provider: any
}

export const signTxnExternalSigner = async ({
  privateKey,
  finalBundle,
  estimation,
  feeSpeed,
  account,
  network,
  provider
}: Props) => {
  if (!privateKey) throw new Error('Invalid signer password - signer decryption failed')

  const wallet = new Wallet(privateKey)

  if (relayerURL) {
    // Temporary way of debugging the fee cost
    // const initialLimit = finalBundle.gasLimit - getFeePaymentConsequences(estimation.selectedFeeToken, estimation).addedGas
    // finalBundle.estimate({ relayerURL, fetch }).then(estimation => console.log('fee costs: ', estimation.gasLimit - initialLimit), estimation.selectedFeeToken).catch(console.error)
    await finalBundle.sign(wallet)
    // eslint-disable-next-line @typescript-eslint/return-await
    return await finalBundle.submit({ relayerURL, fetch })
  }
  // eslint-disable-next-line @typescript-eslint/return-await
  return await sendNoRelayer({
    finalBundle,
    account,
    network,
    wallet,
    estimation,
    feeSpeed,
    provider
  })
}
