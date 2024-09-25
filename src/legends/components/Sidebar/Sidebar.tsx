import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser'
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines'
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import HighlightedLink from './components/HighlightedLink'
import Link from './components/Link'
import Socials from './components/Socials'
import styles from './Sidebar.module.scss'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

const NAVIGATION_LINKS = [
  { to: '/character', text: 'Character', icon: faCircleUser },
  { to: '/legends', text: 'Legends', icon: faMedal },
  { to: '/leaderboard', text: 'Leaderboard', icon: faTrophy },
  { to: '/guide', text: 'Guide', icon: faFileLines }
]

const Sidebar: FC<Props> = ({ isOpen, handleClose }) => {
  const { pathname } = useLocation()

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
          <button onClick={() => {}} type="button" className={styles.spinButton}>
            Spin the Wheel
          </button>
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
