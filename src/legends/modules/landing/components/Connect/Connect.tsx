import React, { useState } from 'react'

import LinesDeco from '@legends/common/assets/svg/LinesDeco'
import useAccountContext from '@legends/hooks/useAccountContext'

// @ts-ignore
import backgroundImage from './assets/background.jpg'
import styles from './Connect.module.scss'

const Connect = () => {
  const { requestAccounts } = useAccountContext()
  const [isDownloadLinkClicked, setIsDownloadLinkClicked] = useState(false)

  const isExtensionInstalled = !!window.ambire

  const onButtonClick = () => {
    if (isExtensionInstalled) {
      requestAccounts()
    } else {
      window.open(
        'https://chromewebstore.google.com/detail/ambire-wallet/ehgjhhccekdedpbkifaojjaefeohnoea',
        '_blank'
      )
      setIsDownloadLinkClicked(true)
    }
  }

  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Become a Legend</h2>
        <button type="button" className={styles.button} onClick={onButtonClick}>
          <LinesDeco className={styles.topLinesDeco} />
          <div className={styles.buttonInner}>
            {isExtensionInstalled ? 'Connect Ambire' : 'Get the Extension'}
          </div>
          <LinesDeco className={styles.bottomLinesDeco} />
        </button>
        {isDownloadLinkClicked && (
          <p className={styles.disclaimer}>
            If you have installed the extension, please refresh the page
          </p>
        )}
      </div>
    </div>
  )
}

export default Connect
