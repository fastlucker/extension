import React from 'react'

import styles from '@legends/modules/legends/components/Card/Card.module.scss'
import CardActionButton, { ButtonProps } from './CardActionButton'

type WrapperProps = {
  children: React.ReactNode
} & ButtonProps

const CardActionWrapper = ({ children, ...buttonProps }: WrapperProps) => {
  return (
    <div>
      <div className={styles.modalAction}>{children}</div>
      <CardActionButton {...buttonProps} />
    </div>
  )
}

export default CardActionWrapper
