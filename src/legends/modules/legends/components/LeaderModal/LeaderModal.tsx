import React from 'react'

import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useRecentActivityContext from '@legends/hooks/useRecentActivityContext'
import useToast from '@legends/hooks/useToast'
import ActionModal from '@legends/modules/legends/components/ActionModal'
import { CardAction, CardActionType } from '@legends/modules/legends/types'

import { PREDEFINED_ACTION_LABEL_MAP } from '../../constants'

interface LeaderModalProps {
  setIsLeaderModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isLeaderModalOpen: boolean
}

const LeaderModal: React.FC<LeaderModalProps> = ({ setIsLeaderModalOpen, isLeaderModalOpen }) => {
  const { getActivity } = useRecentActivityContext()
  const { addToast } = useToast()

  const { legends, isLoading, onLegendComplete } = useLegendsContext()

  const card =
    !isLoading &&
    legends.find(
      (legend) =>
        legend?.action?.type === CardActionType.predefined &&
        legend?.action?.predefinedId === 'referral'
    )

  const { xp, title, flavor, contentSteps, contentImage, contentVideo, action, meta } = card || {}
  const predefinedId =
    action && action?.type === CardActionType.predefined ? action.predefinedId : ''
  const buttonText = PREDEFINED_ACTION_LABEL_MAP[predefinedId] || 'Proceed'

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `🤑Join the biggest airdrop a WALLET has ever done! 🚀 \n \nAmbire Wallet is giving away 195M $WALLET tokens through the Ambire Legends campaign. All activity with a Smart Account on 5 of the hottest EVM chains is rewarded. Start strong with the first 4 transactions free! \n \nHere’s what you need to do: \n1. Download the Ambire extension: https://www.ambire.com/get-extension \n2. Use my referral code so we both get XP: ${
          meta?.invitationKey || ''
        }\n3. Create a Smart Account in the extension and join Ambire Legends at https://legends.ambire.com/`
      )
      addToast('Text with referral code copied to clipboard', 'success')
    } catch (e: any) {
      addToast('Failed to copy referral code', 'error')
    }
  }
  const pollActivityUntilComplete = async (txnId: string, attempt: number) => {
    if (attempt > 10) {
      addToast(ERROR_MESSAGES.transactionProcessingFailed, 'error')
      return
    }

    const newActivity = await getActivity()

    const foundTxn = newActivity?.transactions?.find((txn) => txn.txId === txnId)

    if (!foundTxn) {
      if (attempt === 0) {
        addToast('We are processing your transaction. Expect your reward shortly.', 'info')
      }

      setTimeout(() => pollActivityUntilComplete(txnId, attempt + 1), 1000)
      return
    }

    const latestXpReward = foundTxn.legends.totalXp

    if (latestXpReward) {
      addToast(`Transaction completed! Reward ${latestXpReward} XP`, 'success')
    } else {
      addToast('Transaction completed!', 'success')
    }

    await onLegendComplete()
  }

  const closeActionModal = () => setIsLeaderModalOpen(false)

  return (
    <ActionModal
      isOpen={isLeaderModalOpen}
      setIsOpen={setIsLeaderModalOpen}
      title={title || ''}
      flavor={flavor}
      xp={xp}
      contentImage={contentImage}
      buttonText={buttonText}
      onLegendCompleteWrapped={(txnId: string) => pollActivityUntilComplete(txnId, 0)}
      closeActionModal={closeActionModal}
      copyToClipboard={copyToClipboard}
      contentSteps={contentSteps}
      contentVideo={contentVideo}
      action={action || ({} as CardAction)}
      meta={meta}
      predefinedId={predefinedId}
    />
  )
}

export default LeaderModal
