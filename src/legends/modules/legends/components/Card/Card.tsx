import React, { FC, useMemo, useState } from 'react'

import Modal from '@legends/components/Modal'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useRecentActivityContext from '@legends/hooks/useRecentActivityContext'
import WheelComponent from '@legends/modules/legends/components/WheelComponentModal'
import { calculateHoursUntilMidnight } from '@legends/modules/legends/components/WheelComponentModal/helpers'
import { CardFromResponse, CardStatus, CardType } from '@legends/modules/legends/types'

import Rewards from '@legends/modules/legends/components/Card/Rewards'
import { PREDEFINED_ACTION_LABEL_MAP } from '../../constants'
import styles from './Card.module.scss'
import CardActionComponent from './CardAction'

type Props = Pick<
  CardFromResponse,
  'title' | 'description' | 'flavor' | 'xp' | 'image' | 'card' | 'action'
>

const CARD_FREQUENCY: { [key in CardType]: string } = {
  [CardType.daily]: 'Daily',
  [CardType.oneTime]: 'One-time',
  [CardType.recurring]: 'Ongoing'
}

const Card: FC<Props> = ({ title, image, description, flavor, xp, card, action }) => {
  const { activity } = useRecentActivityContext()
  const { onLegendComplete } = useLegendsContext()

  const disabled = card.status === CardStatus.disabled
  const isCompleted = card.status === CardStatus.completed
  const buttonText = PREDEFINED_ACTION_LABEL_MAP[action.predefinedId || ''] || 'Proceed'
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)

  const [isFortuneWheelModalOpen, setIsFortuneWheelModalOpen] = useState(false)

  const openActionModal = () =>
    action.predefinedId === 'wheelOfFortune'
      ? setIsFortuneWheelModalOpen(true)
      : setIsActionModalOpen(true)

  const closeActionModal = () =>
    action.predefinedId === 'wheelOfFortune'
      ? setIsFortuneWheelModalOpen(false)
      : setIsActionModalOpen(false)

  const onLegendCompleteWrapped = async () => {
    await onLegendComplete()
    closeActionModal()
  }

  const hoursUntilMidnight = useMemo(
    () => (activity?.transactions ? calculateHoursUntilMidnight(activity.transactions) : 0),
    [activity]
  )

  return (
    <div className={`${styles.wrapper} ${disabled && styles.disabled}`}>
      <Modal
        isOpen={isActionModalOpen}
        setIsOpen={setIsActionModalOpen}
        showCloseButton={false}
        className={styles.modal}
      >
        <Modal.Heading className={styles.modalHeading}>
          <div className={styles.modalHeadingTitle}>{title}</div>
          {xp && <Rewards xp={xp} size="lg" />}
        </Modal.Heading>
        <Modal.Text className={styles.modalText}>{flavor}</Modal.Text>
        <CardActionComponent
          onComplete={onLegendCompleteWrapped}
          buttonText={buttonText}
          action={action}
        />
      </Modal>
      {action.predefinedId === 'wheelOfFortune' && (
        <WheelComponent isOpen={isFortuneWheelModalOpen} setIsOpen={setIsFortuneWheelModalOpen} />
      )}
      {isCompleted ? (
        <div className={styles.completed}>
          <span className={styles.completedText}>
            Completed <br />
            {action.predefinedId === 'wheelOfFortune' ? (
              <span
                className={styles.completedTextAvailable}
              >{`Available in ${hoursUntilMidnight} hours`}</span>
            ) : null}
          </span>
        </div>
      ) : null}
      <div className={styles.imageAndBadges}>
        <img src={image} alt={title} className={styles.image} />
      </div>
      <div className={styles.contentAndAction}>
        <div className={styles.content}>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <div className={styles.rewards}>
            <span className={styles.rewardType}>{CARD_FREQUENCY[card.type]}</span>
            <Rewards xp={xp} size="sm" />
          </div>
        </div>
        <button
          disabled={disabled}
          className={styles.button}
          type="button"
          onClick={openActionModal}
        >
          {action.type ? buttonText : 'Read more'}
        </button>
      </div>
    </div>
  )
}

export default Card
