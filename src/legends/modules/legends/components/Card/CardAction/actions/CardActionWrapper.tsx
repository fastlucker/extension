import React from 'react'

import styles from '@legends/modules/legends/components/Card/Card.module.scss'

const CardActionWrapper = ({
  children,
  onButtonClick,
  buttonText,
  disabled = false,
  isLoading = false,
  loadingText = 'Loading...'
}: {
  children?: React.ReactNode
  onButtonClick: () => void
  buttonText: string
  disabled?: boolean
  isLoading?: boolean
  loadingText?: string
}) => {
  return (
    <div>
      {children && <div className={styles.modalAction}>{children}</div>}
      <button
        disabled={disabled || isLoading}
        onClick={onButtonClick}
        type="button"
        className={styles.button}
      >
        {!isLoading ? buttonText : loadingText}
      </button>
    </div>
  )
}

export default CardActionWrapper
