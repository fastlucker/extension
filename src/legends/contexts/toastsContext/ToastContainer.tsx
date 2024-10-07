import React from 'react'

import Toast from './Toast'
import styles from './Toast.module.scss'
import { ToastProps } from './types'

interface ToastsContainerProps {
  toasts: ToastProps[]
}

const ToastsContainer: React.FC<ToastsContainerProps> = ({ toasts }) => {
  return (
    <div className={styles.toastsContainer}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

export default ToastsContainer
