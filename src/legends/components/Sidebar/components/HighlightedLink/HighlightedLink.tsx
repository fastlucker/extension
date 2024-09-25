import React, { FC } from 'react'

import styles from './HighlightedLink.module.scss'

type Props = {
  image?: string
  title: string
  text: string
  children: React.ReactNode
}

const HighlightedLink: FC<Props> = ({ image, title, text, children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {image && <img className={styles.image} src={image} alt={title} />}
        <div className={styles.textAndTitle}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.text}>{text}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default HighlightedLink
