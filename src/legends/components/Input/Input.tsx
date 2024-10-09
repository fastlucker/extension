import React, { FC } from 'react'

import styles from './Input.module.scss'

type Props = {
  label?: string
  state?: 'default' | 'error'
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
}

const Input: FC<Props> = ({ placeholder, label, value, state = 'default', onChange }) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={label} className={styles.label}>
          {label}
        </label>
      )}
      <input
        placeholder={placeholder}
        onChange={onChange}
        className={`${styles.input} ${styles[state]}`}
        id={label}
        type="text"
        value={value}
      />
    </div>
  )
}

export default Input
