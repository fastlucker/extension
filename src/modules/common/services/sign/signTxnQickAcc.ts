import { Wallet } from 'ethers'

import CONFIG from '@config/env'
import { isExtension } from '@web/constants/browserAPI'

import alert from '../alert'

const relayerURL = CONFIG.RELAYER_URL

const signTxnQuickAcc = async ({
  quickAccCredentials,
  finalBundle,
  primaryKeyBackup,
  signature
}: any) => {
  if (!finalBundle.recoveryMode) {
    // Make sure we let React re-render without blocking (decrypting and signing will block)
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 0))
    const pwd = quickAccCredentials.password
    if (!pwd) {
      !isExtension && alert('Enter password')
    }
    const wallet = await Wallet.fromEncryptedJson(JSON.parse(primaryKeyBackup), pwd)
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
