import React, { FC } from 'react'

import styles from './Badge.module.scss'

type Props = {
  label: string
  value: number
  type?: 'primary' | 'secondary' | 'highlight'
}

const Badge: FC<Props> = ({ label, value, type = 'primary' }) => {
  return (
    <div className={`${styles.wrapper} ${styles[type]}`}>
      <span className={styles.value}>+{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default Badge
