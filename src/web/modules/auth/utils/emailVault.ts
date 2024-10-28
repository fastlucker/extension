import { fetchCaught } from '@common/services/fetch'

const showEmailVaultInterest = async (
  extensionInstanceId: string | null,
  accountCount: number,
  addToast: (text: string, opts?: { type?: 'error' }) => void
) => {
  try {
    if (!extensionInstanceId) throw new Error('Extension instance ID is missing')
    await fetchCaught(
      `https://relayer.ambire.com/v2/getActions/createEmailAccount/${extensionInstanceId}/${accountCount}`
    )
    addToast('Successfully registered interest in email-recoverable accounts')
  } catch (e) {
    addToast('Failed to register interest in email-recoverable accounts', { type: 'error' })
    console.error(e)
  }
}

export { showEmailVaultInterest }
