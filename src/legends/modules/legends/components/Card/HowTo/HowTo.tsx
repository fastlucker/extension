import React, { FC } from 'react'

import YouTubeVideo from './components/YouTubeVideo'
import styles from './HowTo.module.scss'

export type HowToProps = {
  steps: string[]
  image?: string
  imageAlt?: string
  video?: string
  children?: React.ReactNode
}

const HowTo: FC<HowToProps> = ({ steps, image, imageAlt, children, video }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        <div className={styles.stepper}>
          {steps.map((step, index) => (
            <div key={step} className={styles.step}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepTitle}>{step}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.column}>
        {children || (
          <>
            {image && <img className={styles.image} src={image} alt={imageAlt} />}
            {video && <YouTubeVideo className={styles.video} src={video} />}
          </>
        )}
      </div>
    </div>
  )
}

export default HowTo
