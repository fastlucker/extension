import React, { FC } from 'react'

import GoldenLockIcon from '@legends/common/assets/svg/GoldenLockIcon'
import MidnightTimer from '@legends/components/MidnightTimer'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardFromResponse, CardStatus, CardType } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils'

import styles from './CardContent.module.scss'
import Counter from './Counter'
import Flask from './Flask'
import Rewards from './Rewards'

type Props = Pick<
  CardFromResponse,
  'title' | 'xp' | 'image' | 'card' | 'action' | 'timesCollectedToday'
> & {
  openActionModal: () => void
  disabled: boolean
  buttonText: string
}

const CARD_FREQUENCY: { [key in CardType]: string } = {
  [CardType.daily]: 'Daily',
  [CardType.oneTime]: 'One-time',
  [CardType.recurring]: 'Ongoing',
  [CardType.weekly]: 'Weekly'
}

const CardContent: FC<Props> = ({
  title,
  xp,
  image,
  timesCollectedToday,
  card,
  action,
  openActionModal,
  disabled,
  buttonText
}) => {
  const isCompleted = card.status === CardStatus.completed

  return (
    <div className={`${styles.wrapper} ${disabled && styles.disabled}`}>
      {isCompleted ? (
        <div className={styles.overlay}>
          <Flask />
          <div className={styles.overlayTitle}>
            Completed
            {isMatchingPredefinedId(action, CARD_PREDEFINED_ID.wheelOfFortune) ||
            isMatchingPredefinedId(action, CARD_PREDEFINED_ID.chest) ? (
              <MidnightTimer className={styles.overlayText} />
            ) : null}
          </div>
        </div>
      ) : null}
      {disabled && (
        <div className={styles.overlay}>
          <GoldenLockIcon className={styles.lockIcon} width={80} height={80} />
          <div className={styles.overlayTitle}>Coming soon</div>
        </div>
      )}
      <div className={styles.imageAndCounter}>
        <button
          disabled={disabled}
          type="button"
          onClick={openActionModal}
          className={styles.imageButtonWrapper}
        >
          <img src={image} alt={title} className={styles.image} />
        </button>
        <Counter width={48} height={48} count={timesCollectedToday} className={styles.counter} />
      </div>
      <div className={styles.contentAndAction}>
        <div className={styles.content}>
          <h2 className={styles.heading}>{title}</h2>
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

export default CardContent
