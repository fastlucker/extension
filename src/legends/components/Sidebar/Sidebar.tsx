import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Tooltip, TooltipRefProps } from 'react-tooltip'

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser'
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines'
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useActivityContext from '@legends/hooks/useActivityContext'
import WheelComponent from '@legends/modules/legends/components/WheelComponentModal'
import { isWheelSpinTodayAvailable } from '@legends/modules/legends/components/WheelComponentModal/helpers'
import { useLegends } from '@legends/modules/legends/hooks'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

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
  const tooltipRef = useRef<TooltipRefProps>(null)

  const { pathname } = useLocation()
  const [isFortuneWheelModalOpen, setIsFortuneWheelModalOpen] = useState(false)
  const { activity, isLoading } = useActivityContext()
  const { legends, isLoading: isLegendsLoading } = useLegends()
  const containerRef = useRef(null)

  const handleModal = () => {
    setIsFortuneWheelModalOpen(!isFortuneWheelModalOpen)
  }

  const wheelSpinOfTheDay = useMemo(
    () => isWheelSpinTodayAvailable({ legends, isLegendsLoading }),
    [legends, isLegendsLoading]
  )

  const closeTooltip = useCallback(() => {
    tooltipRef?.current?.close()
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current as HTMLElement

    container.addEventListener('mouseleave', closeTooltip)

    return () => {
      container.removeEventListener('mouseleave', () => closeTooltip)
    }
  }, [closeTooltip])

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
          <div className={styles.wheelOfFortune} data-tooltip-id="wheel-tooltip">
            <img
              src="/images/sidebar/spin-the-wheel.png"
              alt="Daily Legend"
              className={styles.wheelImage}
            />
            <div className={styles.wheelContent}>
              <span className={styles.wheelTitle}>Daily Legend</span>
              <span className={styles.wheelText}>
                {wheelSpinOfTheDay ? 'Not Available' : 'Available Now'}
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
        {wheelSpinOfTheDay && (
          <Tooltip
            id="wheel-tooltip"
            openOnClick
            closeEvents={{ click: true }}
            className={styles.tooltip}
            ref={tooltipRef}
          >
            {' '}
            Spin the wheel is available once a day. Come back tomorrow!
          </Tooltip>
        )}
        <WheelComponent isOpen={isFortuneWheelModalOpen} setIsOpen={setIsFortuneWheelModalOpen} />
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
