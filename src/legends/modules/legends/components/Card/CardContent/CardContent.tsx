import React, { FC } from 'react'

import LockIcon from '@legends/common/assets/svg/LockIcon'
import MidnightTimer from '@legends/components/MidnightTimer'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardFromResponse, CardStatus, CardType } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils'

import styles from './CardContent.module.scss'
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
  console.log(xp)
  return (
    <div className={`${styles.wrapper} ${disabled && styles.disabled}`}>
      {isCompleted ? (
        <div className={styles.overlay}>
          <CompletedRibbon className={styles.overlayIcon} />
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
          <LockIcon className={styles.overlayIcon} />
          <div className={styles.overlayTitle}>Coming soon</div>
        </div>
      )}
      <div className={styles.contentAndAction}>
        <div className={styles.content}>
          <span className={styles.rewardFrequency}>{CARD_FREQUENCY[card.type]}</span>
          <h2 className={styles.heading}>{title}</h2>
        </div>
        <div className={styles.actionAndRewards}>
          <button
            disabled={disabled}
            className={styles.button}
            type="button"
            onClick={openActionModal}
          >
            {/* {action.type ? buttonText : 'Read more'} */}
            Open
          </button>
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
