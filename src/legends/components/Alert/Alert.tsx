import React, { FC } from 'react'

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Alert.module.scss'

type Props = {
  title: string
  type?: 'success' | 'error' | 'warning' | 'info'
  message?: string
  className?: string
}

const ICON_MAP = {
  success: faCheckCircle,
  error: faExclamationCircle,
  info: faInfoCircle,
  warning: faExclamationCircle
}

const Alert: FC<Props> = ({ title, message, className, type = 'info' }) => {
  return (
    <div className={`${styles.wrapper} ${styles[type]} ${className}`}>
      <FontAwesomeIcon icon={ICON_MAP[type]} className={styles.icon} />
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  )
}

export default Alert
