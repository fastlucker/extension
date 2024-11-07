import React from 'react'

import Alert from '@legends/components/Alert'
import useCharacterContext from '@legends/hooks/useCharacterContext'

import styles from './CharacterSection.module.scss'

const LONG_NAME_THRESHOLD = 10

const CharacterSection = () => {
  const { character } = useCharacterContext()

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
        <div className={styles.levelWrapper}>
          <div className={styles.levelInfo}>
            <span className={styles.level}>Level {character.level}</span>
            <span className={styles.xp}>
              {character.xp} / {xpForNextLevel} XP
            </span>
          </div>
          <div className={styles.levelProgress}>
            <div
              className={styles.levelProgressBar}
              style={{ width: `${(character.xp / xpForNextLevel) * 100}%` }}
            />
          </div>
        </div>
        <p className={styles.characterAbout}>{character.description}</p>
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
