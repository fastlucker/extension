import React from 'react'

import styles from '@legends/modules/legends/components/Card/Card.module.scss'

const CardActionWrapper = ({
  children,
  onButtonClick,
  buttonText,
  disabled = false
}: {
  children: React.ReactNode
  onButtonClick: () => void
  buttonText: string
  disabled?: boolean
}) => {
  return (
    <div>
      <div className={styles.modalAction}>{children}</div>
      <button disabled={disabled} onClick={onButtonClick} type="button" className={styles.button}>
        {buttonText}
      </button>
    </div>
  )
}

export default CardActionWrapper
