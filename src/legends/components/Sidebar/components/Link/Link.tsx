import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Link.module.scss'

type Props = {
  to: string
  text: string
  icon: any
  isActive: boolean
  newTab?: boolean
  isExternalLink?: boolean
}

const Link: FC<Props> = ({ to, text, icon, isActive, newTab, isExternalLink }) => {
  return (
    <RouterLink
      to={to}
      className={`${styles.wrapper} ${isActive ? styles.active : ''} ${
        isExternalLink ? styles.activeExternal : ''
      } ${!to ? styles.disabled : ''}`}
      target={newTab ? '_blank' : undefined}
    >
      <div className={styles.iconWrapper}>
        <FontAwesomeIcon size="lg" icon={icon} />
      </div>
      <span>{text}</span>
    </RouterLink>
  )
}

export default Link
