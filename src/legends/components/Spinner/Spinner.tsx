import React, { FC } from 'react'

import styles from './Spinner.module.scss'

type Props = {
  variant?: 'primaryBackground' | 'secondaryBackground' | 'tertiaryBackground'
  size?: number
}

const Spinner: FC<Props> = ({ variant = 'tertiaryBackground', size = 32 }) => {
  return (
    <div
      className={`${styles.wrapper} ${styles[variant]}`}
      style={{
        width: size,
        height: size
      }}
    />
  )
}

export default Spinner
