import { formatUnits } from 'ethers'
import React, { useRef } from 'react'

import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import InfoIcon from '@common/assets/svg/InfoIcon'
import Tooltip from '@common/components/Tooltip'
import LockIcon from '@legends/common/assets/svg/LockIcon'
import AccountInfo from '@legends/components/AccountInfo'
import Alert from '@legends/components/Alert'
import Stacked from '@legends/components/Stacked'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import useLeaderboardContext from '@legends/hooks/useLeaderboardContext'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

import styles from './CharacterSection.module.scss'
import rewardsCoverImg from './rewards-cover-image.png'

const CharacterSection = () => {
  const { character } = useCharacterContext()
  const { accountPortfolio, claimableRewardsError, claimableRewards, isLoadingClaimableRewards } =
    usePortfolioControllerState()
  const { userLeaderboardData } = useLeaderboardContext()
  const { isReady, amountFormatted } = accountPortfolio || {}
  const formatXp = (xp: number) => {
    return xp && xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left // x position inside the card
    const y = e.clientY - rect.top // y position inside the card

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100

    const rotateX = ((centerY - y) / centerY) * 15 // max 10deg
    const rotateY = ((x - centerX) / centerX) * 15

    card.style.setProperty('--pointer-x', `${percentX}%`)
    card.style.setProperty('--pointer-y', `${percentY}%`)
    card.style.setProperty('--rotate-x', `${rotateX}deg`)
    card.style.setProperty('--rotate-y', `${rotateY}deg`)
    card.style.setProperty('--scale', '1.07')
  }

  const resetRotation = () => {
    const card = cardRef.current
    card.style.setProperty('--rotate-x', '0deg')
    card.style.setProperty('--rotate-y', '0deg')
    card.style.setProperty('--pointer-x', '50%')
    card.style.setProperty('--pointer-y', '50%')
    card.style.setProperty('--scale', '1')
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

  const xpForNextLevel = Math.ceil(((character.level + 1) * 4.5) ** 2)

  const startXpForCurrentLevel = character.level === 1 ? 0 : Math.ceil((character.level * 4.5) ** 2)

  const rewardsDisabledState =
    Number((amountFormatted ?? '0').replace(/[^0-9.-]+/g, '')) < 500 ||
    (userLeaderboardData?.level ?? 0) <= 2

  return (
    <>
      <div className={styles.rewardsWrapper}>
        <div
          ref={cardRef}
          className={styles.rewardsBadgeWrapper}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetRotation}
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
              {(rewardsDisabledState || isLoadingClaimableRewards || claimableRewardsError) && (
                <LockIcon className={styles.lockIcon} width={25} height={35} color="currentColor" />
              )}
            </div>
            <div className={styles.rewardsInfo}>
              {isLoadingClaimableRewards || !isReady ? (
                <p>Loading rewards...</p>
              ) : claimableRewardsError ? (
                <p>Error loading rewards</p>
              ) : rewardsDisabledState ? (
                <p className={styles.rewardsTitle}>
                  You need to reach Level 3 and keep a minimum balance of <br /> $500 on the
                  supported networks to start accruing rewards.
                </p>
              ) : (
                <>
                  <p className={styles.rewardsTitle}>$WALLET Rewards</p>
                  <p className={styles.rewardsAmount}>
                    {formatDecimals(
                      parseFloat(
                        claimableRewards
                          ? formatUnits(
                              BigInt(claimableRewards?.value || '0'),
                              claimableRewards?.decimals || 18
                            )
                          : '0'
                      )
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className={`${styles.wrapper} ${styles[`wrapper${character.characterType}`]}`}>
        <div className={styles.characterInfo}>
          <AccountInfo
            removeAvatarAndLevel
            wrapperClassName={styles.accountInfo}
            addressClassName={styles.accountInfoAddress}
            displayTooltip
          />
          <div className={styles.characterLevelInfoWrapper}>
            <div className={styles.characterItemWrapper}>
              <div className={styles.levelWrapper}>
                <div className={`${styles.levelInfo} ${styles.levelInfoTop}`}>
                  <span className={styles.startXp}>Lvl. {character.level}</span>
                  <span className={styles.endXp}>Lvl. {character.level + 1}</span>
                </div>
                <div className={styles.levelProgress}>
                  <div className={styles.levelProgressBarWrapper}>
                    <span className={styles.level}>{formatXp(startXpForCurrentLevel)}</span>
                    <span className={styles.level}>{formatXp(xpForNextLevel)}</span>
                  </div>
                  <div
                    className={styles.levelProgressBar}
                    style={{
                      width: `${(
                        ((character.xp - startXpForCurrentLevel) /
                          (xpForNextLevel - startXpForCurrentLevel)) *
                        100
                      ).toFixed(2)}%`
                    }}
                  />
                </div>

                <div className={styles.xp}>{formatXp(character.xp)} XP</div>
              </div>
            </div>

            <div className={styles.logoAndBalanceWrapper}>
              <div className={styles.logoWrapper}>
                <Stacked chains={['1', '8453', '42161', '534352', '10']} />
              </div>
              <div className={styles.characterItemWrapper}>
                <div className={styles.characterItem}>
                  <span className={styles.item}>{isReady ? amountFormatted : 'Loading...'}</span>
                  <div className={styles.characterInfoWrapper}>
                    Wallet Balance
                    <InfoIcon
                      width={12}
                      height={12}
                      color="currentColor"
                      className={styles.infoIcon}
                      data-tooltip-id="wallet-info"
                    />
                    <Tooltip
                      style={{
                        backgroundColor: '#101114',
                        color: '#F4F4F7',
                        fontFamily: 'FunnelDisplay',
                        fontSize: 11,
                        lineHeight: '16px',
                        fontWeight: 300,
                        maxWidth: 244,
                        boxShadow: '0px 0px 12.1px 0px #191B20'
                      }}
                      place="bottom"
                      id="wallet-info"
                      content="The balance consists of discovered tokens on the following networks: Ethereum, Base, Optimism, Arbitrum and Scroll."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.characterItemWrapper}>
              <div className={styles.characterItem}>
                <span className={styles.item}>
                  {userLeaderboardData?.rank ? userLeaderboardData?.rank : 'Loading...'}
                </span>
                <div className={styles.characterInfoWrapper}>
                  Leaderboard
                  <InfoIcon
                    width={12}
                    height={12}
                    color="currentColor"
                    className={styles.infoIcon}
                    data-tooltip-id="leaderboard-info"
                  />
                  <Tooltip
                    style={{
                      backgroundColor: '#101114',
                      color: '#F4F4F7',
                      fontFamily: 'FunnelDisplay',
                      fontSize: 11,
                      lineHeight: '16px',
                      fontWeight: 300,
                      maxWidth: 244,
                      boxShadow: '0px 0px 12.1px 0px #191B20'
                    }}
                    place="bottom"
                    id="leaderboard-info"
                    content="This is how you rank against everyone else participating in Ambire Legends based on your collected XP."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.characterBlurEffect}
          style={{ backgroundImage: `url(${character.image})` }}
        />

        <div className={styles.character}>
          <div className={styles.characterRelativeWrapper}>
            <img
              className={styles.characterImage}
              src={character.image}
              alt={character.characterName}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default CharacterSection
