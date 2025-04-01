import React from 'react'

import Alert from '@legends/components/Alert'
import Stacked from '@legends/components/Stacked'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import useLeaderboardContext from '@legends/hooks/useLeaderboardContext'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

import styles from './CharacterSection.module.scss'

const CharacterSection = () => {
  const { character } = useCharacterContext()
  const { accountPortfolio } = usePortfolioControllerState()
  const { userLeaderboardData } = useLeaderboardContext()
  const { isReady, amountFormatted } = accountPortfolio || {}

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

  return (
    <section className={styles.wrapper}>
      <div className={styles.characterInfo}>
        <h2 className={styles.kicker}>Stats</h2>
        <div className={styles.characterLevelInfoWrapper}>
          <div className={styles.characterItemWrapper}>
            <div className={styles.levelWrapper}>
              <div className={`${styles.levelInfo} ${styles.levelInfoTop}`}>
                <span className={styles.startXp}>Lvl. {character.level}</span>
                <span className={styles.endXp}>Lvl. {character.level + 1}</span>
              </div>
              <div className={styles.levelProgress}>
                <div className={styles.levelProgressBarWrapper}>
                  <span className={styles.level}>{startXpForCurrentLevel}</span>
                  <span className={styles.level}>{xpForNextLevel}</span>
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

              <div className={styles.xp}>
                {character.xp}
                XP
              </div>
            </div>
          </div>

          <div className={styles.logoAndBalanceWrapper}>
            <div className={styles.logoWrapper}>
              <Stacked chains={['1', '8453', '42161', '534352', '10']} />
            </div>
            <div className={styles.characterItemWrapper}>
              <div className={styles.characterItem}>
                <span className={styles.item}>{isReady ? amountFormatted : 'Loading...'}</span>
                Wallet Balance
              </div>
            </div>
          </div>

          <div className={styles.characterItemWrapper}>
            <div className={styles.characterItem}>
              <span className={styles.item}>
                {userLeaderboardData?.rank ? userLeaderboardData?.rank : 'Loading...'}
              </span>
              Leaderboard
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
          <img className={styles.characterImage} src={character.image} alt="" />
        </div>
      </div>
    </section>
  )
}

export default CharacterSection
