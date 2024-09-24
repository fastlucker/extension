import React, { FC } from 'react'

import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './HighlightedLink.module.scss'

type Props = {
  image?: string
  title: string
  text: string
  buttonText: string
  buttonIcon?: IconDefinition
  onClick: () => void
}

const HighlightedLink: FC<Props> = ({ image, title, text, buttonText, buttonIcon, onClick }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {image && <img className={styles.image} src={image} alt={title} />}
        <div className={styles.textAndTitle}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.text}>{text}</p>
        </div>
      </div>
      <button className={styles.button} onClick={onClick} type="button">
        {buttonIcon && <FontAwesomeIcon icon={buttonIcon} />}
        {buttonText}
      </button>
    </div>
  )
}

export default HighlightedLink
