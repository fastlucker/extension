import React, { FC, useMemo } from 'react'

import styles from './Input.module.scss'

type Props = {
  label?: string
  validation?: {
    message: string
    isError: boolean
  } | null
  infoLabel?: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Label: FC<Pick<Props, 'label' | 'className'>> = ({ label, className }) => {
  return (
    <label htmlFor={label} className={`${styles.label} ${className}`}>
      {label}
    </label>
  )
}

const Field: FC<
  Props & {
    className?: string
  }
> = ({ validation, className, label, ...props }) => {
  const state = useMemo(() => {
    if (!validation) return 'default'

    return !validation.isError ? 'valid' : 'error'
  }, [validation])

  return (
    <input className={`${styles.input} ${styles[state]} ${className}`} type="text" {...props} />
  )
}

const ValidationAndInfo: FC<Pick<Props, 'validation' | 'infoLabel'>> = ({
  validation,
  infoLabel
}) => {
  return (
    <>
      <div className={styles.infoLabel}>{infoLabel}</div>
      {validation && validation.message && (
        <p
          className={`${styles.validationMessage} ${
            styles[!validation.isError ? 'valid' : 'error']
          }`}
        >
          {validation.message}
        </p>
      )}
    </>
  )
}

const Input = ({ placeholder, label, infoLabel, validation, value, onChange, ...props }: Props) => {
  return (
    <div className={styles.wrapper}>
      {label && <Label label={label} />}
      <Field placeholder={placeholder} onChange={onChange} id={label} value={value} {...props} />
      <ValidationAndInfo validation={validation} infoLabel={infoLabel || ''} />
    </div>
  )
}

Input.Label = Label
Input.Field = Field
Input.ValidationAndInfo = ValidationAndInfo

export type { Props as InputProps }

export default Input
