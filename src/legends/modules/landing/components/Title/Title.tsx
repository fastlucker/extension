import React, { FC } from 'react'

import LinesDeco2 from '@legends/common/assets/svg/LinesDeco2'

import styles from './Title.module.scss'

type Props = {
  title: string
  className?: string
  wrapperClassName?: string
}

const Title: FC<Props> = ({ title, className = '', wrapperClassName = '' }) => {
  return (
    <div className={`${styles.wrapper} ${wrapperClassName}`}>
      <h2 className={`${styles.title} ${className}`}>{title}</h2>
      <LinesDeco2 />
    </div>
  )
}

export default Title
