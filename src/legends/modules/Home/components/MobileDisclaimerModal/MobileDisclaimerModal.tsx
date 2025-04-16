import React, { useState } from 'react'

import styles from './MobileDisclaimerModal.module.scss'

const MobileDisclaimerModal = () => {
  const [isAccepted, setIsAccepted] = useState(() => {
    const isAcceptedBefore = localStorage.getItem('mobileDisclaimerAccepted')

    return isAcceptedBefore === 'true'
  })

  const handleAccept = () => {
    setIsAccepted(true)
    localStorage.setItem('mobileDisclaimerAccepted', 'true')
  }

  return (
    <div className={`${styles.backdrop} ${isAccepted ? styles.hidden : ''}`}>
      <div className={styles.modal}>
        <p className={styles.text}>
          The Ambire Legends app is <strong>desktop-only</strong>. To connect, install the Ambire
          Wallet extension on a Chromium-based desktop browser like Chrome, Edge, Brave, Opera, or
          Arc.
        </p>
        <button type="button" className={styles.button} onClick={handleAccept}>
          Okay
        </button>
      </div>
    </div>
  )
}

export default MobileDisclaimerModal
