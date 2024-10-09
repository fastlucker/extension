import React, { useEffect, useState } from 'react'

import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Address from '@legends/components/Address'
import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'

import styles from './AccountDropdown.module.scss'

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { connectedAccount, disconnectAccount } = useAccountContext()
  const { character } = useCharacterContext()

  const toggleIsOpen = () => setIsOpen((prev) => !prev)

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

  if (!connectedAccount || !character) return null

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} type="button" onClick={toggleIsOpen}>
        <div className={styles.avatarWrapper}>
          <img alt="avatar" className={styles.avatar} src={character.image_avatar} />
        </div>
        <div className={styles.account}>
          <Address className={styles.address} address={connectedAccount} maxAddressLength={12} />
          <p className={styles.levelAndRank}>Level {character.level} / Rank 203</p>
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
