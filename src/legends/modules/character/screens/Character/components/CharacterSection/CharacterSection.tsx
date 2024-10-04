import React from 'react'

import useCharacterContext from '@legends/hooks/useCharacterContext'
import styles from './CharacterSection.module.scss'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const CharacterSection = () => {
  const { character } = useCharacterContext()

  return (
    <section className={styles.wrapper}>
      <div className={styles.characterInfo}>
        <span className={styles.kicker}>YOUR CHARACTER</span>
        <div className={styles.characterNameAndLevel}>
          <h1 className={styles.characterName}>{capitalizeFirstLetter(character.characterType)}</h1>
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
