import React, { FC, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import CopyIcon from '@common/assets/svg/CopyIcon'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser'
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines'
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Leader from '@legends/common/assets/svg/Leader'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useToast from '@legends/hooks/useToast'
import LeaderModal from '@legends/modules/legends/components/LeaderModal'
import WheelComponent from '@legends/modules/legends/components/WheelComponentModal'
import { timeUntilMidnight } from '@legends/modules/legends/components/WheelComponentModal/helpers'
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
    to: 'https://codex.ambire.com/',
    text: 'Guide',
    icon: faFileLines,
    newTab: true,
    isExternalLink: true
  }
]

const Sidebar: FC<Props> = ({ isOpen, handleClose }) => {
  const { addToast } = useToast()
  const { pathname } = useLocation()
  const [isFortuneWheelModalOpen, setIsFortuneWheelModalOpen] = useState(false)
  const { wheelSpinOfTheDay, legends, isLoading } = useLegendsContext()
  const containerRef = useRef(null)
  const legendLeader = legends.find((legend) => legend.title === 'Leader')
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)

  const handleModal = () => {
    setIsFortuneWheelModalOpen(!isFortuneWheelModalOpen)
  }

  const copyInvitationKey = () => {
    if (!legendLeader?.meta?.invitationKey) {
      addToast('No invitation key to copy', 'error')
      return
    }
    navigator.clipboard.writeText(legendLeader?.meta?.invitationKey)
    addToast('Copied to clipboard')
  }

  const wheelText = useMemo(() => {
    if (isLoading) return 'Loading...'

    if (wheelSpinOfTheDay) return timeUntilMidnight().label

    return 'Spin the Wheel'
  }, [wheelSpinOfTheDay, isLoading])

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
              <span className={styles.wheelText}>{wheelText}</span>
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
        <LeaderModal
          setIsActionModalOpen={setIsActionModalOpen}
          isActionModalOpen={isActionModalOpen}
        />
        <WheelComponent isOpen={isFortuneWheelModalOpen} setIsOpen={setIsFortuneWheelModalOpen} />
        <div className={styles.links}>
          {NAVIGATION_LINKS.map((link) => (
            <Link
              isActive={pathname === link.to}
              key={link.to}
              to={link.to}
              text={link.text}
              icon={link.icon}
              newTab={link.newTab}
            />
          ))}
        </div>
        {legendLeader && legendLeader?.meta && (
          <div className={styles.leaderSection}>
            <div className={styles.leaderHeader}>
              <button
                type="button"
                className={styles.inviteTitle}
                onClick={() => setIsActionModalOpen(true)}
              >
                Invite a friend
              </button>
              <div>
                {[...Array(legendLeader?.meta?.timesUsed || 0)].map((_, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Leader key={`filled-${index}`} variant="filled" />
                ))}
                {[
                  ...Array(
                    (legendLeader?.meta?.maxHits || 0) - (legendLeader?.meta?.timesUsed || 0)
                  )
                ].map((_, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Leader key={`empty-${index}`} />
                ))}
              </div>
            </div>
            <div className={styles.gradientBorder}>
              <div
                className={`${styles.leaderInvitationKey} ${
                  legendLeader?.meta?.timesUsed === legendLeader?.meta?.maxHits &&
                  styles.gradientBorderInner
                }`}
              >
                {legendLeader?.meta?.timesUsed === legendLeader?.meta?.maxHits ? (
                  'You are a Leader'
                ) : (
                  <>
                    {legendLeader?.meta?.invitationKey}{' '}
                    <button type="button" onClick={copyInvitationKey}>
                      <CopyIcon color="#706048" className={styles.leaderCopyButton} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Socials />
    </div>
  )
}

export default Sidebar
