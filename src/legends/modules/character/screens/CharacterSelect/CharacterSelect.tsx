import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'
import CharacterSlider from './components/CharacterSlider'
import styles from './CharacterSelect.module.scss'

const CharacterSelect = () => {
  const [characterId, setCharacterId] = useState(1)
  const accountContext = useAccountContext()
  const { character, mintCharacter, isMinting } = useCharacterContext()

  const onCharacterChange = (id) => {
    setCharacterId(id)
  }

  if (!accountContext.connectedAccount) return <Navigate to="/" />
  if (character && character.characterType !== 'unknown')
    return <Navigate to={LEGENDS_ROUTES.character} />

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Choose a Character</h1>
      <p className={styles.description}>
        Select your character, who will start at level 0. By completing quests and accumulating XP,
        you&apos;ll level up and climb the leaderboard.
        <br />
        <br />✨ Choosing a character will mint an NFT on the Base chain.
      </p>
      <CharacterSlider initialCharacterId={characterId} onCharacterChange={onCharacterChange} />

      <button
        onClick={() => mintCharacter(characterId)}
        type="button"
        disabled={isMinting}
        className={styles.saveButton}
      >
        {isMinting ? 'Please wait ...' : 'Choose'}
      </button>
      <div />
    </div>
  )
}

export default CharacterSelect
