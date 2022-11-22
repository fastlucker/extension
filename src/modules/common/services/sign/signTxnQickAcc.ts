import { Wallet } from 'ethers'

import CONFIG from '@config/env'

const relayerURL = CONFIG.RELAYER_URL

type Props = {
  password: string
  finalBundle: any
  primaryKeyBackup: string
  signature: any
}

export const signTxnQuickAcc = async ({ finalBundle, primaryKeyBackup, signature }: Props) => {
  if (!finalBundle.recoveryMode) {
    // Make sure we let React re-render without blocking (decrypting and signing will block)
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 0))
    const wallet = await Wallet.fromEncryptedJson(JSON.parse(primaryKeyBackup), password)
    await finalBundle.sign(wallet)
  } else {
    // set both .signature and .signatureTwo to the same value: the secondary signature
    // this will trigger a timelocked txn
    finalBundle.signature = signature
  }
  finalBundle.signatureTwo = signature
  // eslint-disable-next-line @typescript-eslint/return-await
  return await finalBundle.submit({ relayerURL, fetch })
}
