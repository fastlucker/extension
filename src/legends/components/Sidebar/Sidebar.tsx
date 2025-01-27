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
import TreasureChestClosed from '@legends/common/assets/svg/TreasureChestClosed'
import MidnightTimer from '@legends/components/MidnightTimer'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useToast from '@legends/hooks/useToast'
import LeaderModal from '@legends/modules/legends/components/LeaderModal'
import TreasureChestComponentModal from '@legends/modules/legends/components/TreasureChestComponentModal'
import WheelComponent from '@legends/modules/legends/components/WheelComponentModal'
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
  const { wheelSpinOfTheDay, treasureChestOpenedForToday, legends, isLoading } = useLegendsContext()
  const [isTreasureChestModalOpen, setIsTreasureChestModalOpen] = useState(false)
  const containerRef = useRef(null)
  const legendLeader = legends.find((legend) => legend.title === 'Leader')
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false)
  const isChestOpenedForToday = treasureChestOpenedForToday

  const handleModal = () => {
    setIsFortuneWheelModalOpen(!isFortuneWheelModalOpen)
  }

  const handleLeaderModal = () => {
    setIsLeaderModalOpen(!isLeaderModalOpen)
  }

  const copyInvitationKey = () => {
    if (!legendLeader?.meta?.invitationKey) {
      addToast('No invitation key to copy', { type: 'error' })
      return
    }
    navigator.clipboard.writeText(legendLeader?.meta?.invitationKey)
    addToast('Copied to clipboard')
  }

  const wheelText = useMemo(() => {
    if (isLoading) return <span className={styles.wheelText}>Loading...</span>
    if (wheelSpinOfTheDay) return <MidnightTimer className={styles.wheelText} />

    return <span className={styles.wheelText}>Spin the Wheel</span>
  }, [isLoading, wheelSpinOfTheDay])

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
              {wheelText}
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
          setIsLeaderModalOpen={setIsLeaderModalOpen}
          isLeaderModalOpen={isLeaderModalOpen}
        />
        <WheelComponent isOpen={isFortuneWheelModalOpen} setIsOpen={setIsFortuneWheelModalOpen} />

        <TreasureChestComponentModal
          isOpen={isTreasureChestModalOpen}
          setIsOpen={setIsTreasureChestModalOpen}
        />
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

        <div
          className={styles.treasureChestWrapper}
          onClick={() => setIsTreasureChestModalOpen(true)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsTreasureChestModalOpen(true)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Open Treasure Chest"
        >
          {isChestOpenedForToday ? (
            <div className={styles.chestAvailableLabel}>
              <MidnightTimer type="minutes" />
            </div>
          ) : (
            ''
          )}
          <TreasureChestClosed width={100} height={80} />
        </div>
      </div>
      <div>
        {legendLeader && legendLeader?.meta && (
          <div className={styles.leaderSection}>
            <div className={styles.leaderHeader}>
              <button type="button" className={styles.inviteTitle} onClick={handleLeaderModal}>
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
        <Socials />
      </div>
    </div>
  )
}

export default Sidebar
