import React, { FC, useMemo } from 'react'

import styles from './Input.module.scss'

type Props = {
  label?: string
  validation?: {
    message: string
    isValid: boolean
  } | null
  infoLabel?: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input: FC<Props> = ({
  placeholder,
  label,
  infoLabel,
  validation,
  value,
  onChange,
  ...props
}) => {
  const state = useMemo(() => {
    if (!validation) return 'default'

    return validation.isValid ? 'valid' : 'error'
  }, [validation])

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
        {...props}
      />
      <div className={styles.infoLabel}>{infoLabel}</div>
      {validation && validation.message && (
        <p
          className={`${styles.validationMessage} ${
            styles[validation.isValid ? 'valid' : 'error']
          }`}
        >
          {validation.message}
        </p>
      )}
    </div>
  )
}

export default Input
