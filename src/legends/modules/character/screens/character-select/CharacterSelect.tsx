import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import CharacterSlider from '@legends/modules/character/screens/components/CharacterSlider/CharacterSlider'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

import useAccountContext from '@legends/hooks/useAccountContext'
import styles from './CharacterSelect.module.scss'

const CharacterSelect = () => {
  const accountContext = useAccountContext()
  const navigate = useNavigate()

  const selectCharacter = () => {
    alert('Not implemented')
    navigate(LEGENDS_ROUTES.character)
  }

  if (!accountContext.connectedAccount) return <Navigate to="/" />

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Choose a Character</h1>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id nisl fringilla, aliquet
        elit sit amet, feugiat nisi. Vestibulum condimentum aliquet tortor, eu laoreet magna luctus
        et.
      </p>
      <CharacterSlider />

      <button onClick={selectCharacter} type="button" className={styles.saveButton}>
        Choose
      </button>
      <div />
    </div>
  )
}

export default CharacterSelect
