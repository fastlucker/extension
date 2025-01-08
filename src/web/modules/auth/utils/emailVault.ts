import { fetchCaught } from '@common/services/fetch'

const NO_INSTANCE_ID_ROUTE = '694206942069'

const showEmailVaultInterest = async (
  extensionInstanceId: string,
  accountCount: number,
  addToast: (text: string, opts?: { type?: 'error' }) => void
) => {
  try {
    const extensionInstanceIdRoute = extensionInstanceId || NO_INSTANCE_ID_ROUTE
    await fetchCaught(
      `https://relayer.ambire.com/v2/getActions/createEmailAccount/${extensionInstanceIdRoute}/${accountCount}`
    )
    addToast('Successfully registered interest in email-recoverable accounts')
  } catch (e) {
    addToast('Failed to register interest in email-recoverable accounts', { type: 'error' })
    console.error(e)
  }
}

export { showEmailVaultInterest }
