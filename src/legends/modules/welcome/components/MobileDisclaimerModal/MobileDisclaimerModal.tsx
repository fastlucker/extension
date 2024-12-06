import React, { useState } from 'react'

import RhombusDeco2 from '@legends/common/assets/svg/RhombusDeco2'

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
        <RhombusDeco2 className={styles.topDeco} />
        <RhombusDeco2 className={styles.bottomDeco} />
        <RhombusDeco2 className={styles.leftDeco} />
        <RhombusDeco2 className={styles.rightDeco} />
        <p className={styles.text}>
          The Ambire Legends dApp is <strong>desktop-only</strong>. To play, install the Ambire
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
