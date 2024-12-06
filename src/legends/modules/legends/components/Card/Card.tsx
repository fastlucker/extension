import React, { FC, useMemo, useState } from 'react'

import Modal from '@legends/components/Modal'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useRecentActivityContext from '@legends/hooks/useRecentActivityContext'
import WheelComponent from '@legends/modules/legends/components/WheelComponentModal'
import { calculateHoursUntilMidnight } from '@legends/modules/legends/components/WheelComponentModal/helpers'
import { CardFromResponse, CardStatus, CardType } from '@legends/modules/legends/types'

import Rewards from '@legends/modules/legends/components/Card/Rewards'
import Counter from '@legends/modules/legends/components/Card/Counter'
import { PREDEFINED_ACTION_LABEL_MAP } from '../../constants'
import styles from './Card.module.scss'
import CardActionComponent from './CardAction'

type Props = Pick<
  CardFromResponse,
  'title' | 'description' | 'flavor' | 'xp' | 'image' | 'card' | 'action' | 'timesCollectedToday'
>

const CARD_FREQUENCY: { [key in CardType]: string } = {
  [CardType.daily]: 'Daily',
  [CardType.oneTime]: 'One-time',
  [CardType.recurring]: 'Ongoing',
  [CardType.weekly]: 'Weekly'
}

const Card: FC<Props> = ({ title, image, description, flavor, xp, timesCollectedToday,  card, action }) => {
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
      <div className={styles.imageAndCounter}>
        <img src={image} alt={title} className={styles.image} />
        <Counter
          width={48}
          height={48}
          count={timesCollectedToday}
          className={styles.counter}
        />
      </div>
      <div className={styles.contentAndAction}>
        <div className={styles.content}>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <span className={styles.rewardFrequency}>{CARD_FREQUENCY[card.type]}</span>
          <div className={styles.rewards}>
            <Rewards xp={xp} size="sm" reverse />
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
