import React, { FC } from 'react'

import { faInfinity } from '@fortawesome/free-solid-svg-icons/faInfinity'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Badge from './Badge'
import styles from './Card.module.scss'

type XpReward = {
  label: string
  value: number
}

type Props = {
  heading: string
  image: string
  xpRewards: XpReward[]
  description: string
  repeatable?: boolean
  children?: React.ReactNode | React.ReactNode[]
}

const Card: FC<Props> = ({ heading, image, xpRewards, description, repeatable, children }) => {
  const shortenedDescription = description.length > 60 ? `${description.slice(0, 60)}...` : null
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageAndBadges}>
        <div className={styles.badges}>
          {xpRewards.map(({ value, label }) => (
            <Badge
              type={label === 'Layer 2' ? 'secondary' : 'primary'}
              key={value}
              label={label}
              value={value}
            />
          ))}
        </div>
        {/* TODO: Badges  */}
        <img src={image} alt={heading} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div>
          <h2 className={styles.heading}>{heading}</h2>
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
            {repeatable ? (
              <>
                (Repeatable <FontAwesomeIcon className={styles.repeatableIcon} icon={faInfinity} />)
              </>
            ) : (
              ''
            )}
          </h3>
          <div className={`${styles.rewards} ${children ? styles.mb : ''}`}>
            {xpRewards.map(({ value, label }) => (
              <div key={value} className={styles.reward}>
                <span className={styles.rewardLabel}>{label}</span>
                <span className={styles.rewardValue}>+ {value}</span>
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
