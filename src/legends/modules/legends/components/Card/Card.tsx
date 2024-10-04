import React, { FC } from 'react'

import { faInfinity } from '@fortawesome/free-solid-svg-icons/faInfinity'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardFromResponse, CardType, CardXpType } from '@legends/modules/legends/types'

import Badge from './Badge'
import styles from './Card.module.scss'

type Props = Pick<CardFromResponse, 'title' | 'description' | 'xp' | 'image' | 'card'> & {
  children?: React.ReactNode | React.ReactNode[]
}

const CARD_XP_TYPE_LABELS: {
  [key in CardXpType]: string
} = {
  0: 'Reward',
  1: 'Mainnet',
  2: 'Layer 2'
}

const getBadgeType = (reward: number, type: CardXpType) => {
  if (type === CardXpType.l2) {
    return 'secondary'
  }
  if (reward > 100) {
    return 'highlight'
  }

  return 'primary'
}

const Card: FC<Props> = ({ title, image, description, children, xp, card }) => {
  const isCompleted = card?.type === CardType.done
  const isRecurring = card?.type === CardType.recurring
  const shortenedDescription = description.length > 60 ? `${description.slice(0, 60)}...` : null
  return (
    <div className={`${styles.wrapper}`}>
      {isCompleted ? (
        <div className={styles.completed}>
          <span className={styles.completedText}>Completed</span>
        </div>
      ) : null}
      <div className={styles.imageAndBadges}>
        <div className={styles.badges}>
          {xp?.map(({ from, to, type }) => (
            <Badge
              type={getBadgeType(to, type)}
              key={`${from}-${to}-${type}`}
              label={CARD_XP_TYPE_LABELS[type]}
              value={to}
            />
          ))}
        </div>
        <img src={image} alt={title} className={styles.image} />
      </div>
      <div className={styles.contentAndAction}>
        <div className={styles.content}>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.description}>
            {shortenedDescription || description}{' '}
            {shortenedDescription ? (
              <button
                type="button"
                onClick={() => prompt('This should be a modal')}
                className={styles.readMore}
              >
                Read more
              </button>
            ) : null}
          </p>
          <h3 className={styles.rewardsHeading}>
            XP rewards{' '}
            {isRecurring ? (
              <>
                (Repeatable <FontAwesomeIcon className={styles.repeatableIcon} icon={faInfinity} />)
              </>
            ) : (
              ''
            )}
          </h3>
          <div className={`${styles.rewards} ${children ? styles.mb : ''}`}>
            {xp?.map(({ from, to, type }) => (
              <div key={`${from}-${to}-${type}`} className={styles.reward}>
                <span className={styles.rewardLabel}>{CARD_XP_TYPE_LABELS[type]}</span>
                <span className={styles.rewardValue}>
                  + {from}
                  {to !== from ? `-${to}` : ''} xp
                </span>
              </div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Card
