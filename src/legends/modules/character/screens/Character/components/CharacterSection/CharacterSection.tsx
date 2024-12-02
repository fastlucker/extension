import React from 'react'

import Alert from '@legends/components/Alert'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import useLeaderboardContext from '@legends/hooks/useLeaderboardContext'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

import styles from './CharacterSection.module.scss'
import Crown from './Crown'
import Diamond from './Diamond'
import GoldCoin from './GoldCoin'

const LONG_NAME_THRESHOLD = 10

const CharacterSection = () => {
  const { character } = useCharacterContext()
  const { accountPortfolio } = usePortfolioControllerState()
  const { userLeaderboardData } = useLeaderboardContext()
  const { isReady, error, amountFormatted, amount } = accountPortfolio || {}

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
        <span className={styles.kicker}>YOUR CHARACTER</span>
        <h1
          className={`${styles.characterName} ${
            character?.characterName.length > LONG_NAME_THRESHOLD ? styles.small : ''
          }`}
        >
          {character?.characterName}
        </h1>

        <div className={styles.characterLevelInfoWrapper}>
          <div className={styles.characterItemWrapper}>
            <GoldCoin className={`${styles.icon} ${styles.iconCoin}`} />
            <div className={styles.levelWrapper}>
              <div className={`${styles.levelInfo} ${styles.levelInfoTop}`}>
                <span className={styles.level}>Lvl. {character.level}</span>
                <span className={styles.level}>Lvl. {character.level + 1}</span>
              </div>
              <div className={styles.levelProgress}>
                <span className={styles.xp}>{character.xp} XP</span>

                <div
                  className={styles.levelProgressBar}
                  style={{ width: `${(character.xp / xpForNextLevel) * 100}%` }}
                />
              </div>
              <div className={styles.levelInfo}>
                <span className={styles.level}>{startXpForCurrentLevel}</span>
                <span className={styles.level}>{xpForNextLevel}</span>
              </div>
            </div>
          </div>

          <div className={styles.characterItemWrapper}>
            <Diamond className={styles.icon} />
            <div className={styles.characterItem}>
              {isReady && amount && (
                <>
                  <span className={styles.item}>{amountFormatted}</span>
                  Wallet Balance{' '}
                </>
              )}
            </div>
          </div>

          <div className={styles.characterItemWrapper}>
            <Crown className={styles.icon} />
            <div className={styles.characterItem}>
              <span className={styles.item}>{userLeaderboardData?.rank}</span>
              Leaderboard
            </div>
          </div>
        </div>
      </div>
      <div className={styles.character}>
        <div className={styles.characterRelativeWrapper}>
          <img className={styles.characterImage} src={character.image} alt="" />
        </div>
      </div>
    </section>
  )
}

export default CharacterSection
