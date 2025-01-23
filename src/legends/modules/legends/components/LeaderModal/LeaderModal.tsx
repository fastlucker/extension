import React from 'react'

import useLegendsContext from '@legends/hooks/useLegendsContext'
import ActionModal from '@legends/modules/legends/components/ActionModal'
import { CARD_PREDEFINED_ID, PREDEFINED_ACTION_LABEL_MAP } from '@legends/modules/legends/constants'
import { CardActionType } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils/cards'

interface LeaderModalProps {
  setIsLeaderModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isLeaderModalOpen: boolean
}

const LeaderModal: React.FC<LeaderModalProps> = ({ setIsLeaderModalOpen, isLeaderModalOpen }) => {
  const { legends = [], onLegendComplete } = useLegendsContext()

  const card = legends.find((legend) =>
    isMatchingPredefinedId(legend.action, CARD_PREDEFINED_ID.referral)
  )

  const { contentSteps, action } = card || {}
  const predefinedId =
    action && action?.type === CardActionType.predefined ? action.predefinedId : ''
  const buttonText = PREDEFINED_ACTION_LABEL_MAP[predefinedId] || 'Proceed'

  const closeActionModal = () => setIsLeaderModalOpen(false)

  if (!card) return null

  return (
    <ActionModal
      {...card}
      isOpen={isLeaderModalOpen}
      setIsOpen={setIsLeaderModalOpen}
      buttonText={buttonText}
      steps={contentSteps || []}
      onLegendCompleteWrapped={onLegendComplete}
      closeActionModal={closeActionModal}
      predefinedId={predefinedId}
    />
  )
}

export default LeaderModal
