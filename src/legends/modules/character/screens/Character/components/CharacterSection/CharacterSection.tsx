import React from 'react'

import styles from './CharacterSection.module.scss'
import temporaryCharacter from './sorceress.png'

const CharacterSection = () => {
  const levelProgress = 17
  return (
    <section className={styles.wrapper}>
      <div className={styles.characterInfo}>
        <span className={styles.kicker}>YOUR CHARACTER</span>
        <div className={styles.characterNameAndLevel}>
          <h1 className={styles.characterName}>Sorceress</h1>
          <div className={styles.levelWrapper}>
            <div className={styles.innerCircle}>
              <span className={styles.level}>7</span>
            </div>
            <div
              className={styles.outerCircle}
              style={{
                // @SCSS-VAR: $accent, $tertiaryBackground
                background: `conic-gradient(#e75132 0% ${levelProgress}%, #eaddc9 ${levelProgress}% 100%)`
              }}
            />
          </div>
        </div>
        <p className={styles.characterAbout}>
          The Sorceress is a master of arcane arts, harnessing the elemental forces of fire, ice,
          and lightning to devastate her foes. Born with an innate connection to magic, she has
          honed her skills through years of study in ancient, forgotten tomes. Wielding spells with
          precision, she can summon flames to scorch enemies, freeze them in place, or call down
          lightning to strike with fury. Though physically fragile, her immense magical power makes
          her a force to be reckoned with on the battlefield.
        </p>
      </div>
      <div className={styles.character}>
        <div className={styles.characterRelativeWrapper}>
          <img className={styles.characterImage} src={temporaryCharacter} alt="" />
        </div>
      </div>
    </section>
  )
}

export default CharacterSection
