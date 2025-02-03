import React from 'react'

import styles from './DailyQuestBanner.module.scss'

interface DailyQuestBannerProps {
  isDisabled: boolean
  tooltipId: string
  backgroundImage: string
  title: string
  text: React.ReactNode
  handleClick: () => void
  buttonText: string
  wrapperStyles?: string
}

const DailyQuestBanner: React.FC<DailyQuestBannerProps> = ({
  isDisabled,
  tooltipId,
  backgroundImage,
  title,
  text,
  handleClick,
  buttonText,
  wrapperStyles
}) => (
  <div className={`${styles.wrapper} ${wrapperStyles} ${isDisabled ? styles.disabled : ''}`}>
    <div
      className={styles.banner}
      data-tooltip-id={tooltipId}
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>

        <span className={styles.text}>{text}</span>
        <button onClick={handleClick} disabled={isDisabled} type="button" className={styles.button}>
          {buttonText}
        </button>
      </div>
    </div>
  </div>
)

export default DailyQuestBanner
