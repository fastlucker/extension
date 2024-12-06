import React, { FC, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser'
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines'
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useRecentActivityContext from '@legends/hooks/useRecentActivityContext'
import WheelComponent from '@legends/modules/legends/components/WheelComponentModal'
import { calculateHoursUntilMidnight } from '@legends/modules/legends/components/WheelComponentModal/helpers'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

import wheelBackgroundImage from './assets/wheel-background.png'
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
  {
    to: 'https://grimoires.ambire.com/',
    text: 'Guide',
    icon: faFileLines,
    newTab: true,
    isExternalLink: true
  }
]

const Sidebar: FC<Props> = ({ isOpen, handleClose }) => {
  const { activity } = useRecentActivityContext()

  const hoursUntilMidnight = useMemo(
    () => (activity?.transactions ? calculateHoursUntilMidnight(activity.transactions) : 0),
    [activity]
  )

  const { pathname } = useLocation()
  const [isFortuneWheelModalOpen, setIsFortuneWheelModalOpen] = useState(false)
  const { wheelSpinOfTheDay } = useLegendsContext()
  const containerRef = useRef(null)

  const handleModal = () => {
    setIsFortuneWheelModalOpen(!isFortuneWheelModalOpen)
  }

  return (
    <div className={`${styles.wrapper} ${isOpen ? styles.open : ''}`}>
      <div className={styles.top} ref={containerRef}>
        <button type="button" onClick={handleClose} className={styles.closeButton}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <img className={styles.logo} src="/images/logo.png" alt="Ambire Legends" />
        <div
          className={`${styles.wheelOfFortuneWrapper} ${wheelSpinOfTheDay ? styles.disabled : ''}`}
        >
          <div
            className={styles.wheelOfFortune}
            data-tooltip-id="wheel-tooltip"
            style={{
              backgroundImage: `url(${wheelBackgroundImage})`
            }}
          >
            <div className={styles.wheelContent}>
              <span className={styles.wheelTitle}>Daily Legend</span>
              <span className={styles.wheelText}>
                {wheelSpinOfTheDay ? `Available in ${hoursUntilMidnight} hours` : 'Available Now'}
              </span>
              <button
                onClick={handleModal}
                disabled={wheelSpinOfTheDay}
                type="button"
                className={styles.wheelButton}
              >
                Spin the Wheel
              </button>
            </div>
          </div>
        </div>
        <WheelComponent isOpen={isFortuneWheelModalOpen} setIsOpen={setIsFortuneWheelModalOpen} />
        <div className={styles.links}>
          {NAVIGATION_LINKS.map((link) => (
            <Link
              isActive={pathname === link.to}
              isExternalLink={link.isExternalLink}
              key={link.to}
              to={link.to}
              text={link.text}
              icon={link.icon}
              newTab={link.newTab}
            />
          ))}
        </div>
      </div>
      <Socials />
    </div>
  )
}

export default Sidebar
