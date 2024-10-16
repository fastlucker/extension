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

  // TODO: Replace with actual character name
  const characterName = character.characterType

  return (
    <section className={styles.wrapper}>
      <div className={styles.characterInfo}>
        <span className={styles.kicker}>YOUR CHARACTER</span>
        <div className={styles.characterNameAndLevel}>
          <h1
            className={`${styles.characterName} ${
              characterName.length > LONG_NAME_THRESHOLD ? styles.small : ''
            }`}
          >
            {characterName}
          </h1>
          <div className={styles.levelWrapper}>
            <div className={styles.innerCircle}>
              <span className={styles.level}>{character.level}</span>
            </div>
            <div
              className={styles.outerCircle}
              style={{
                // @SCSS-VAR: $accent, $tertiaryBackground
                background: `conic-gradient(#e75132 0% ${character.level}%, #eaddc9 ${character.level}% 100%)`
              }}
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
