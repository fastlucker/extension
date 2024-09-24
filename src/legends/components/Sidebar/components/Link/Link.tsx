import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Link.module.scss'

type Props = {
  to: string
  text: string
  icon: any
  isActive: boolean
}

const Link: FC<Props> = ({ to, text, icon, isActive }) => {
  return (
    <div className={`${styles.wrapper} ${isActive ? styles.active : ''}`}>
      <div className={styles.iconWrapper}>
        <FontAwesomeIcon size="lg" icon={icon} />
      </div>
      <RouterLink to={to}>{text}</RouterLink>
    </div>
  )
}

export default Link
