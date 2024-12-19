import React, { FC, useState } from 'react'

import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useRecentActivityContext from '@legends/hooks/useRecentActivityContext'
import useToast from '@legends/hooks/useToast'
import ActionModal from '@legends/modules/legends/components/ActionModal'
import { PREDEFINED_ACTION_LABEL_MAP } from '@legends/modules/legends/constants'
import { CardActionType, CardFromResponse, CardStatus } from '@legends/modules/legends/types'

import CardContent from './CardContent'
import OnCompleteModal from './OnCompleteModal'

type Props = Pick<
  CardFromResponse,
  | 'title'
  | 'description'
  | 'flavor'
  | 'xp'
  | 'image'
  | 'card'
  | 'action'
  | 'timesCollectedToday'
  | 'meta'
  | 'contentSteps'
  | 'contentImage'
  | 'contentVideo'
>

const Card: FC<Props> = ({
  title,
  image,
  description,
  flavor,
  xp,
  timesCollectedToday,
  card,
  action,
  meta,
  contentSteps,
  contentImage,
  contentVideo
}) => {
  const disabled = card.status === CardStatus.disabled
  const predefinedId = action.type === CardActionType.predefined ? action.predefinedId : ''
  const buttonText = PREDEFINED_ACTION_LABEL_MAP[predefinedId] || 'Proceed'
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [isOnCompleteModalVisible, setIsOnCompleteModalVisible] = useState(false)
  const { getActivity } = useRecentActivityContext()
  const { onLegendComplete } = useLegendsContext()
  const { addToast } = useToast()

  const openActionModal = () => {
    setIsActionModalOpen(true)
  }

  const closeActionModal = () => {
    setIsActionModalOpen(false)
  }

  const pollActivityUntilComplete = async (txnId: string, attempt: number) => {
    if (attempt > 10) {
      addToast(ERROR_MESSAGES.transactionProcessingFailed, { type: 'error' })
      return
    }

    // We can't rely on state as it's not updated due to the self-invoking nature of the function
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

    // Update all other states
    await onLegendComplete()
  }

  const onLegendCompleteWrapped = async (txnId: string) => {
    await pollActivityUntilComplete(txnId, 0)
    setIsOnCompleteModalVisible(true)
  }

  return (
    <>
      <CardContent
        title={title}
        description={description}
        flavor={flavor}
        xp={xp}
        image={image}
        timesCollectedToday={timesCollectedToday}
        card={card}
        action={action}
        openActionModal={openActionModal}
        disabled={disabled}
        buttonText={buttonText}
      />
      {/* Modals */}
      <OnCompleteModal
        isVisible={isOnCompleteModalVisible}
        setIsVisible={setIsOnCompleteModalVisible}
        predefinedId={predefinedId}
      />
      <ActionModal
        isOpen={isActionModalOpen}
        setIsOpen={setIsActionModalOpen}
        title={title}
        flavor={flavor}
        xp={xp}
        contentSteps={contentSteps}
        contentImage={contentImage}
        contentVideo={contentVideo}
        buttonText={buttonText}
        onLegendCompleteWrapped={onLegendCompleteWrapped}
        closeActionModal={closeActionModal}
        action={action}
        meta={meta}
        predefinedId={predefinedId}
      />
    </>
  )
}

export default React.memo(Card)
