import React from 'react'

import useLegendsContext from '@legends/hooks/useLegendsContext'
import ActionModal from '@legends/modules/legends/components/ActionModal'
import { CARD_PREDEFINED_ID, PREDEFINED_ACTION_LABEL_MAP } from '@legends/modules/legends/constants'
import { CardActionType } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils/cards'

interface LeaderModalProps {
  handleClose: () => void
  isLeaderModalOpen: boolean
}

const LeaderModal: React.FC<LeaderModalProps> = ({ handleClose, isLeaderModalOpen }) => {
  const { legends = [], onLegendComplete } = useLegendsContext()

  const card = legends.find((legend) =>
    isMatchingPredefinedId(legend.action, CARD_PREDEFINED_ID.referral)
  )

  const { contentSteps, action } = card || {}
  const predefinedId =
    action && action?.type === CardActionType.predefined ? action.predefinedId : ''
  const buttonText = PREDEFINED_ACTION_LABEL_MAP[predefinedId] || 'Proceed'

  if (!card) return null

  return (
    <ActionModal
      {...card}
      isOpen={isLeaderModalOpen}
      buttonText={buttonText}
      steps={contentSteps || []}
      onLegendCompleteWrapped={onLegendComplete}
      closeActionModal={handleClose}
      predefinedId={predefinedId}
    />
  )
}

export default LeaderModal
