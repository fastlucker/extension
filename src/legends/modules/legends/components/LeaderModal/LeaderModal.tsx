import React from 'react'

import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useRecentActivityContext from '@legends/hooks/useRecentActivityContext'
import useToast from '@legends/hooks/useToast'
import ActionModal from '@legends/modules/legends/components/ActionModal'
import { CARD_PREDEFINED_ID, PREDEFINED_ACTION_LABEL_MAP } from '@legends/modules/legends/constants'
import { CardActionType } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils/cards'

interface LeaderModalProps {
  setIsLeaderModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isLeaderModalOpen: boolean
}

const LeaderModal: React.FC<LeaderModalProps> = ({ setIsLeaderModalOpen, isLeaderModalOpen }) => {
  const { getActivity } = useRecentActivityContext()
  const { addToast } = useToast()

  const { legends = [], onLegendComplete } = useLegendsContext()

  const card = legends.find((legend) =>
    isMatchingPredefinedId(legend.action, CARD_PREDEFINED_ID.referral)
  )

  const { contentSteps, action } = card || {}
  const predefinedId =
    action && action?.type === CardActionType.predefined ? action.predefinedId : ''
  const buttonText = PREDEFINED_ACTION_LABEL_MAP[predefinedId] || 'Proceed'

  const pollActivityUntilComplete = async (txnId: string, attempt: number) => {
    if (attempt > 10) {
      addToast(ERROR_MESSAGES.transactionProcessingFailed, { type: 'error' })
      return
    }

    const newActivity = await getActivity()

    const foundTxn = newActivity?.transactions?.find((txn) => txn.txId === txnId)

    if (!foundTxn) {
      if (attempt === 0) {
        addToast('We are processing your transaction. Expect your reward shortly.')
      }

      setTimeout(() => pollActivityUntilComplete(txnId, attempt + 1), 1000)
      return
    }

    const latestXpReward = foundTxn.legends.totalXp

    if (latestXpReward) {
      addToast(`Transaction completed! Reward ${latestXpReward} XP`, { type: 'success' })
    } else {
      addToast('Transaction completed!', { type: 'success' })
    }

    await onLegendComplete()
  }

  const closeActionModal = () => setIsLeaderModalOpen(false)

  if (!card) return null

  return (
    <ActionModal
      {...card}
      isOpen={isLeaderModalOpen}
      setIsOpen={setIsLeaderModalOpen}
      buttonText={buttonText}
      steps={contentSteps || []}
      onLegendCompleteWrapped={(txnId: string) => pollActivityUntilComplete(txnId, 0)}
      closeActionModal={closeActionModal}
      predefinedId={predefinedId}
    />
  )
}

export default LeaderModal
