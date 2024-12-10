import React, { FC } from 'react'

import styles from './HowTo.module.scss'
import YouTubeVideo from './components/YouTubeVideo'

type Props = {
  steps: string[]
  image?: string
  imageAlt?: string
  video?: string
}

const HowTo: FC<Props> = ({ steps, image, imageAlt, video }) => {
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
        {image && <img className={styles.image} src={image} alt={imageAlt} />}
        {video && (
          <YouTubeVideo className={styles.video} src={video} />
        )}
      </div>
    </div>
  )
}

export default HowTo
