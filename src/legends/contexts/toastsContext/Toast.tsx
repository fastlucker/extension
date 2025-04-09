import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useToast from '@legends/hooks/useToast/useToast'

import styles from './Toast.module.scss'
import { ToastProps } from './types'

const TOAST_ICONS = {
  success: <FontAwesomeIcon className={styles.icon} icon={faCheckCircle} />,
  warning: <FontAwesomeIcon className={styles.icon} icon={faTriangleExclamation} />,
  info: <FontAwesomeIcon className={styles.icon} icon={faInfoCircle} />,
  error: <FontAwesomeIcon className={styles.icon} icon={faTriangleExclamation} />
}

const TOAST_DURATION = 5000

const Toast = ({ message, type, id }: ToastProps) => {
  const icon = TOAST_ICONS[type]
  const { dismissToast } = useToast()

  const timerID = useRef<null | any>(null) // create a Reference

  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    setTimeout(() => {
      dismissToast(id)
    }, 400)
  }, [id, dismissToast])

  useEffect(() => {
    timerID.current = setTimeout(() => {
      handleDismiss()
    }, TOAST_DURATION)

    return () => {
      if (timerID?.current) {
        clearTimeout(timerID.current)
      }
    }
  }, [handleDismiss])

  return (
    <div className={`${styles.toast} ${styles[type]} ${dismissed ? styles.dismissed : ''}`}>
      {icon}
      <p className={styles.toastMessage}>{message}</p>
      <button onClick={handleDismiss} type="button" className={styles.dismissBtn}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className={styles.toastProgress}>
        <div
          style={{ animationDuration: `${TOAST_DURATION}ms` }}
          className={`${styles.toastProgressBar}`}
        />
      </div>
    </div>
  )
}

export default memo(Toast)
