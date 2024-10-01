import React, { useEffect, useState } from 'react'

import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useAccountContext from '@legends/hooks/useAccountContext'

import styles from './AccountDropdown.module.scss'

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { connectedAccount, disconnectAccount } = useAccountContext()

  const toggleIsOpen = () => setIsOpen((prev) => !prev)

  const formatAddress = (address: string | null) => {
    if (!address) return ''

    const isEns = address.includes('.')
    if (isEns) return address

    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Hide the dropdown when the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (!target.closest(`.${styles.wrapper}`)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} type="button" onClick={toggleIsOpen}>
        <div className={styles.avatarWrapper}>
          <img alt="avatar" className={styles.avatar} src="/images/logo.png" />
        </div>
        <div className={styles.account}>
          <p className={styles.address}>{formatAddress(connectedAccount)}</p>
          <p className={styles.levelAndRank}>Level 7 / Rank 203</p>
        </div>
        <FontAwesomeIcon
          className={`${styles.chevronIcon} ${isOpen ? styles.open : ''}`}
          icon={faChevronDown}
        />
      </button>
      <div className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
        <p className={styles.network}>Connected on Base Network</p>
        <button className={styles.disconnectButton} type="button" onClick={disconnectAccount}>
          Disconnect
        </button>
      </div>
    </div>
  )
}

export default AccountDropdown
