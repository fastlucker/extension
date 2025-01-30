import { ToastOptions } from '@common/contexts/toastContext'
import { RELAYER_URL } from '@env'
import { ActivityTransaction, LegendActivity } from '@legends/contexts/recentActivityContext/types'

const checkTransactionStatus = async (
  connectedAccount: string | null,
  txAction: string,
  getLegends: () => Promise<void>,
  setState: any,
  addToast: (message: string, options?: ToastOptions) => void
) => {
  try {
    const response = await fetch(`${RELAYER_URL}/legends/activity/${connectedAccount}`)

    if (!response.ok) throw new Error('Failed to fetch transaction status')

    const data = await response.json()
    const today = new Date().toISOString().split('T')[0]
    const transaction: ActivityTransaction | undefined = data.transactions.find(
      (txn: ActivityTransaction) =>
        txn.submittedAt.startsWith(today) &&
        txn.legends.activities &&
        txn.legends.activities.some(
          (activity: LegendActivity) =>
            activity.action.startsWith(txAction) ||
            activity.action.includes(txAction) ||
            activity.action === txAction
        )
    )

    if (!transaction) return false
    const dailyRewardActivity = transaction.legends.activities.find((activity: any) => {
      return activity.action.includes(txAction)
    })

    if (!dailyRewardActivity) return false

    await getLegends()
    setState && setState()
    addToast(`You received ${dailyRewardActivity.xp}xp!`, {
      type: 'success'
    })
    return true
  } catch (error) {
    console.error('Error fetching transaction status:', error)
    return false
  }
}

export { checkTransactionStatus }
