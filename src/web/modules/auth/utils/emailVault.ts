import { fetchCaught } from '@common/services/fetch'
import { browser } from '@web/constants/browserapi'

const showEmailVaultInterest = async (
  accountCount: number,
  addToast: (text: string, opts?: { type?: 'error' }) => void
) => {
  try {
    const instanceId = browser.runtime.id

    if (!instanceId) throw new Error('No instance ID found')

    await fetchCaught(
      `https://relayer.ambire.com/v2/getActions/createEmailAccount/${instanceId}/${accountCount}`
    )
    addToast('Successfully registered interest in email-recoverable accounts')
  } catch {
    addToast('Failed to register interest in email-recoverable accounts', { type: 'error' })
  }
}

export { showEmailVaultInterest }
