import React, { FC } from 'react'

import LockIcon from '@legends/common/assets/svg/LockIcon'
import smokeAndLights from '@legends/modules/leaderboard/screens/Leaderboard/Smoke-and-lights.png'
import { CardFromResponse, CardStatus, CardType } from '@legends/modules/legends/types'

import styles from './CardContent.module.scss'
import cardImage from './cardImage.png'
import CompletedRibbon from './CompletedRibbon'

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
  [CardType.recurring]: 'Recurring',
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
    <div
      className={`${styles.wrapper} ${(disabled || isCompleted) && styles.disabled}`}
      role="button"
      onClick={() => {
        if (!disabled && !isCompleted) {
          openActionModal()
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openActionModal()
        }
      }}
      tabIndex={0}
    >
      {isCompleted ? (
        <div className={styles.overlay}>
          <CompletedRibbon className={styles.overlayIcon} />
          {/* <div className={styles.overlayTitle}>
            Completed
            {isMatchingPredefinedId(action, CARD_PREDEFINED_ID.wheelOfFortune) ||
            isMatchingPredefinedId(action, CARD_PREDEFINED_ID.chest) ? (
              <MidnightTimer className={styles.overlayText} />
            ) : null}
          </div> */}
        </div>
      ) : null}
      {disabled && (
        <div className={styles.overlay}>
          <LockIcon className={styles.overlayIcon} />
          {/* <div className={styles.overlayTitle}>Coming soon</div> */}
        </div>
      )}
      <div className={styles.contentAndAction}>
        <div className={styles.content}>
          <h2 className={styles.heading}>{title}</h2>
          <img src={cardImage} alt="Card" className={styles.image} />
          <div
            className={styles.backgroundEffect}
            style={{
              backgroundImage: `url(${smokeAndLights})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          />
        </div>
        <div className={styles.actionAndRewards}>
          <div className={styles.rewardFrequencyWrapper}>
            <span
              className={`${styles.rewardFrequency} ${
                styles[`rewardFrequency${CARD_FREQUENCY[card.type]}`]
              }`}
            >
              {CARD_FREQUENCY[card.type]}
            </span>
          </div>
          <div>
            <div className={styles.rewardTitle}>
              {Array.isArray(xp) && xp.length > 1 ? (
                <>
                  Up to <br />
                  <span className={styles.xp}>{Math.max(...xp.map((x) => x.to))}</span>
                </>
              ) : (
                <>
                  Earn <br />
                  <span className={styles.xp}>
                    {xp[0].from === xp[0].to ? `${xp[0].from}` : `${xp[0].from}-${xp[0].to} `}
                  </span>{' '}
                </>
              )}
              <span className={styles.xpText}>XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardContent
