import React, { FC } from 'react'

import LockIcon from '@legends/common/assets/svg/LockIcon'
import ZapIcon from '@legends/common/assets/svg/ZapIcon'
import smokeAndLights from '@legends/modules/leaderboard/screens/Leaderboard/Smoke-and-lights.png'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardFromResponse, CardStatus, CardType } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils/cards'

import styles from './CardContent.module.scss'
import cardImage from './cardImage.png'
import CompletedRibbon from './CompletedRibbon'

type Props = Pick<
  CardFromResponse,
  'title' | 'xp' | 'image' | 'card' | 'action' | 'timesCollectedToday'
> & {
  openActionModal: () => void
  disabled: boolean
  treasureChestStreak: number | undefined
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
  card,
  action,
  openActionModal,
  disabled,
  treasureChestStreak
}) => {
  const isCompleted = card.status === CardStatus.completed

  const isTreasureChestCard = isMatchingPredefinedId(action, CARD_PREDEFINED_ID.chest)

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
            {isTreasureChestCard && treasureChestStreak ? (
              <div className={styles.streak}>
                <ZapIcon width={14} height={19} />
                <p className={styles.streakNumber}>{treasureChestStreak}</p>
                <p className={styles.streakLabel}>
                  {treasureChestStreak === 1 ? 'Day' : 'Days'} Streak
                </p>
              </div>
            ) : (
              <span
                className={`${styles.rewardFrequency} ${
                  styles[`rewardFrequency${CARD_FREQUENCY[card.type]}`]
                }`}
              >
                {CARD_FREQUENCY[card.type]}
              </span>
            )}
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
