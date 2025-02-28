import React, { useEffect, useState } from 'react'

import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import glowingButton from '@legends/common/assets/images/glowing-button.png'
import DecoratedArrowDown from '@legends/common/assets/svg/DecoratedArrowDown'
import RhombusDeco from '@legends/common/assets/svg/RhombusDeco'
import useAccountContext from '@legends/hooks/useAccountContext'

import backgroundSm from './assets/background-sm.png'
import backgroundXlImage from './assets/background-xl.jpg'
import backgroundXl2xImage from './assets/background-xl@x2.jpg'
import inviteImage from './assets/invite.png'
import styles from './Hero.module.scss'

const Hero = () => {
  const { requestAccounts } = useAccountContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDownloadLinkClicked, setIsDownloadLinkClicked] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (hasScrolled) return

      if (window.scrollY > 50) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasScrolled])

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

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMenuOpen) return

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
        event.stopPropagation()
        event.preventDefault()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <div className={styles.wrapper}>
      <picture className={styles.background}>
        <source srcSet={backgroundXlImage} media="(min-width: 600px)" />
        <source srcSet={`${backgroundXl2xImage} 2x`} media="(min-width: 600px)" />
        <img src={backgroundSm} alt="background" />
      </picture>
      <div className={styles.container}>
        <div className={styles.content}>
          <img src="/images/logo.png" alt="Ambire Legends" className={styles.logo} />
          <h1 className={styles.title}>
            Master Smart Accounts and Get Rewarded for Your Onchain Activity
          </h1>
          <div className={styles.actions}>
            <div className={styles.buttonAndDisclaimer}>
              <button
                type="button"
                className={styles.button}
                style={{
                  backgroundImage: `url(${glowingButton})`
                }}
                onClick={onButtonClick}
              >
                <div className={styles.buttonInner}>
                  <RhombusDeco className={styles.leftDeco} />
                  {!isExtensionInstalled ? 'Get the Extension' : 'Connect Ambire'}
                  <RhombusDeco className={styles.rightDeco} />
                </div>
              </button>
              {isDownloadLinkClicked && (
                <p className={styles.disclaimer}>
                  If you have installed the extension, please refresh the page
                </p>
              )}
            </div>

            <div className={`${styles.invitation} ${isMenuOpen ? styles.open : ''}`} ref={menuRef}>
              <button type="button" onClick={toggleMenu} className={styles.invitationButton}>
                <img src={inviteImage} alt="Invite" className={styles.invitationImage} />
              </button>
              <div className={styles.invitationMenu}>
                <a
                  href="https://www.ambire.com/discord"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.menuSocial}
                >
                  <FontAwesomeIcon className={styles.socialIcon} icon={faDiscord} />
                  <span className={styles.socialName}>Discord</span>
                </a>
                <a
                  href="https://t.me/AmbireOfficial"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.menuSocial}
                >
                  <FontAwesomeIcon className={styles.socialIcon} icon={faTelegram} />
                  <span className={styles.socialName}>Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DecoratedArrowDown className={`${styles.arrowDown} ${hasScrolled ? styles.scrolled : ''}`} />
    </div>
  )
}

export default Hero
