import React, { FC } from 'react'

import styles from './Spinner.module.scss'

type Props = {
  variant?: 'primaryBackground' | 'secondaryBackground' | 'tertiaryBackground'
  size?: number
  isCentered?: boolean
}

const Spinner: FC<Props> = ({ variant = 'tertiaryBackground', size = 32, isCentered }) => {
  return (
    <div className={isCentered ? styles.container : ''}>
      <div
        className={`${styles.wheel} ${styles[variant]}`}
        style={{
          width: size,
          height: size
        }}
      />
    </div>
  )
}

export default Spinner
