import React from 'react'

import CharacterSlider from '@legends/modules/character/screens/components/CharacterSlider/CharacterSlider'

import styles from './CharacterSelect.module.scss'

const CharacterSelect = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Choose a Character</h1>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id nisl fringilla, aliquet
        elit sit amet, feugiat nisi. Vestibulum condimentum aliquet tortor, eu laoreet magna luctus
        et.
      </p>
      <CharacterSlider />

      <button className={styles.saveButton}>Save selection</button>
      <div />
    </div>
  )
}

export default CharacterSelect
