import React, { useRef, useState } from 'react'

import InfoIcon from '@common/assets/svg/InfoIcon'
import Tooltip from '@common/components/Tooltip'
import rewardsCoverImg from '@legends/common/assets/images/rewards-cover-image.png'
import HourGlassIcon from '@legends/common/assets/svg/HourGlassIcon'
import LockIcon from '@legends/common/assets/svg/LockIcon'
import AccountInfo from '@legends/components/AccountInfo'
import Alert from '@legends/components/Alert'
import Stacked from '@legends/components/Stacked'
import { LEGENDS_SUPPORTED_NETWORKS_BY_CHAIN_ID } from '@legends/constants/networks'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import useLeaderboardContext from '@legends/hooks/useLeaderboardContext'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'
import ClaimRewardsModal from '@legends/modules/legends/components/ClaimRewardsModal'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { Networks } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils'

import walletCoin from './assets/wallet-coin.png'
import styles from './Home.module.scss'

const Home = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { character } = useCharacterContext()
  const { legends, isLoading } = useLegendsContext()
  const claimWalletCard = legends?.find((card) =>
    isMatchingPredefinedId(card.action, CARD_PREDEFINED_ID.claimRewards)
  )
  const { accountPortfolio, claimableRewardsError, isLoadingClaimableRewards } =
    usePortfolioControllerState()
  const { userLeaderboardData } = useLeaderboardContext()
  const { isReady, amountFormatted } = accountPortfolio || {}
  const formatXp = (xp: number) => {
    return xp && xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }
  const cardRef = useRef<HTMLDivElement>(null)

  const closeClaimModal = () => {
    setIsOpen(false)
  }
  const openClaimModal = () => {
    setIsOpen(true)
  }
  const handleMouseMove = (e: any) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()

    // Get the mouse position relative to the card
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate the center of the card
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate the distance from the center
    const distanceFromCenterX = Math.abs(centerX - mouseX)
    const distanceFromCenterY = Math.abs(centerY - mouseY)

    // Calculate the rotation based on the distance from the center
    const xSign = mouseX > centerX ? 1 : -1
    const ySign = mouseY > centerY ? 1 : -1
    const rotateX = (distanceFromCenterX / centerX) * 10 * xSign
    const rotateY = (distanceFromCenterY / centerY) * 8 * ySign

    // Calculate the inverse percentage for the pointer position
    const inverseX = 100 - (mouseX / rect.width) * 100
    const inverseY = 100 - (mouseY / rect.height) * 100

    card.style.setProperty('--pointer-x', `${inverseX}%`)
    card.style.setProperty('--pointer-y', `${inverseY}%`)
    card.style.setProperty('--rotate-x', `${rotateX}deg`)
    card.style.setProperty('--rotate-y', `${rotateY}deg`)
    card.style.setProperty('--scale', '1.05')
    card.style.setProperty('--perspective', '1000px')
  }

  const resetRotation = () => {
    const card = cardRef.current
    if (!card) return

    // Reset the styles
    card.style.setProperty('--rotate-x', '0deg')
    card.style.setProperty('--rotate-y', '0deg')
    card.style.setProperty('--pointer-x', '50%')
    card.style.setProperty('--pointer-y', '50%')
    card.style.setProperty('--scale', '1')
    card.style.setProperty('--perspective', '0px')
  }

  if (!character)
    return (
      <Alert
        className={styles.error}
        type="error"
        title="Failed to load character"
        message="Please try again later or contact support if the issue persists."
      />
    )

  const rewardsDisabledState = Number(claimWalletCard?.meta?.availableToClaim) === 0

  const isNotAvailableForRewards =
    Number((amountFormatted ?? '0').replace(/[^0-9.-]+/g, '')) < 500 ||
    (userLeaderboardData?.level ?? 0) <= 2

  return (
    <>
      <div className={styles.rewardsWrapper}>
        <ClaimRewardsModal
          isOpen={isOpen}
          handleClose={closeClaimModal}
          action={claimWalletCard?.action}
          meta={claimWalletCard?.meta}
          card={claimWalletCard?.card}
        />
        <div
          ref={cardRef}
          className={`${styles.rewardsBadgeWrapper} ${
            !rewardsDisabledState && claimWalletCard?.meta?.availableToClaim ? styles.active : ''
          }`}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetRotation}
          onClick={(e) =>
            !rewardsDisabledState && claimWalletCard?.meta?.availableToClaim && openClaimModal()
          }
          onKeyDown={(e) => e.key === 'Enter' && openClaimModal()}
          role="button"
          tabIndex={0}
          aria-label="Open rewards claim modal"
        >
          <div className={styles.rewardsBadge}>
            <div className={styles.rewardsCoverImgWrapper}>
              <img
                src={rewardsCoverImg}
                className={`${styles.rewardsCoverImg} ${
                  (rewardsDisabledState || isLoadingClaimableRewards || claimableRewardsError) &&
                  styles.rewardsCoverImgDisabled
                }`}
                alt="rewards-cover"
              />
              {(rewardsDisabledState || isLoadingClaimableRewards || claimableRewardsError) &&
                (Number(claimWalletCard?.meta?.availableToClaim) === 0 &&
                !isNotAvailableForRewards ? (
                  <HourGlassIcon
                    className={styles.lockIcon}
                    width={29}
                    height={37}
                    color="currentColor"
                  />
                ) : (
                  <LockIcon
                    className={styles.lockIcon}
                    width={29}
                    height={37}
                    color="currentColor"
                  />
                ))}
            </div>
            <div className={styles.rewardsInfo}>
              {isLoadingClaimableRewards || isLoading ? (
                <p>Loading rewards...</p>
              ) : claimableRewardsError ? (
                <p>Error loading rewards</p>
              ) : rewardsDisabledState ? (
                <p className={styles.rewardsTitle}>
                  {Number(claimWalletCard?.meta?.availableToClaim) === 0 &&
                  !isNotAvailableForRewards ? (
                    "You haven't accumulated $WALLET rewards yet."
                  ) : (
                    <>
                      You need to reach Level 3 and keep a minimum balance of
                      <br />
                      $500 on the supported networks to start accruing rewards.
                    </>
                  )}
                </p>
              ) : (
                <>
                  <p className={styles.rewardsTitle}>$WALLET Rewards</p>
                  <p className={styles.rewardsAmount}>
                    {claimWalletCard?.meta?.availableToClaim
                      ? Math.floor(Number(claimWalletCard?.meta?.availableToClaim))
                          .toLocaleString('en-US', { useGrouping: true })
                          .replace(/,/g, ' ')
                      : '0'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className={`${styles.wrapper}`}>
        <div className={styles.walletInfo}>
          <h1 className={styles.title}>
            <span className={styles.dollarSign}>$</span>WALLET
          </h1>

          <div className={styles.walletLevelInfoWrapper}>
            <div className={styles.logoAndBalanceWrapper}>
              <div className={styles.walletItemWrapper}>
                <div className={styles.walletItem}>
                  <div className={styles.walletInfoWrapper}>Circulating supply</div>
                  <span className={styles.item}>688,248,948</span>
                </div>
              </div>
            </div>
            <div className={styles.walletItemWrapper}>
              <div className={styles.walletItem}>
                Staked $WALLET
                <span className={styles.item}>45%</span>
                <div className={styles.walletInfoWrapper} />
              </div>
            </div>
            <div className={styles.walletItemWrapper}>
              <div className={styles.walletItem}>
                <div className={styles.walletInfoWrapper}>Current Price</div>
                <span className={styles.item}>$0.013</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.walletBlurEffect}
          style={{ backgroundImage: `url(${walletCoin})` }}
        />

        <div className={styles.wallet}>
          <div className={styles.walletRelativeWrapper}>
            <img className={styles.walletImage} src={walletCoin} alt="wallet-coin" />
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
