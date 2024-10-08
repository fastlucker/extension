import React, { FC, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser'
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines'
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import WheelComponent from '@legends/modules/legends/components/WheelComponentModal'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

import HighlightedLink from './components/HighlightedLink'
import Link from './components/Link'
import Socials from './components/Socials'
import styles from './Sidebar.module.scss'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

const NAVIGATION_LINKS = [
  { to: LEGENDS_ROUTES.character, text: 'Character', icon: faCircleUser },
  { to: LEGENDS_ROUTES.legends, text: 'Legends', icon: faMedal },
  { to: LEGENDS_ROUTES.leaderboard, text: 'Leaderboard', icon: faTrophy },
  { to: '', text: 'Guide', icon: faFileLines }
]

const Sidebar: FC<Props> = ({ isOpen, handleClose }) => {
  const { pathname } = useLocation()
  const [isFortuneWheelModalOpen, setIsFortuneWheelModalOpen] = useState(false)

  const handleModal = () => {
    setIsFortuneWheelModalOpen(!isFortuneWheelModalOpen)
  }

  return (
    <div className={`${styles.wrapper} ${isOpen ? styles.open : ''}`}>
      <div className={styles.top}>
        <button type="button" onClick={handleClose} className={styles.closeButton}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <img className={styles.logo} src="/images/logo.png" alt="Ambire Legends" />
        <HighlightedLink
          image="/images/sidebar/spin-the-wheel.png"
          title="Daily Legend"
          text="Available Now"
        >
          <button onClick={handleModal} type="button" className={styles.spinButton}>
            Spin the Wheel
          </button>
          <WheelComponent isOpen={isFortuneWheelModalOpen} setIsOpen={setIsFortuneWheelModalOpen} />
        </HighlightedLink>
        <div className={styles.links}>
          {NAVIGATION_LINKS.map((link) => (
            <Link
              isActive={pathname === link.to}
              key={link.to}
              to={link.to}
              text={link.text}
              icon={link.icon}
            />
          ))}
        </div>
      </div>
      <Socials />
    </div>
  )
}

export default Sidebar
