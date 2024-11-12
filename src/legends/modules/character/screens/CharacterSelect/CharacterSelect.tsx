import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import NonV2Modal from '@legends/components/NonV2Modal'
import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import useToast from '@legends/hooks/useToast'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

import styles from './CharacterSelect.module.scss'
import CharacterLoadingModal from './components/CharacterLoadingModal'
import CharacterSlider from './components/CharacterSlider'
import useMintCharacter from './hooks/useMintCharacter'

const CharacterSelect = () => {
  const { addToast } = useToast()

  const [characterId, setCharacterId] = useState(1)
  const accountContext = useAccountContext()
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [navigateToCharacter, setNavigateToCharacter] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { character, isLoading, getCharacter } = useCharacterContext()
  const { isMinting, isMinted, loadingMessage, mintCharacter, checkIfCharacterIsMinted } =
    useMintCharacter()

  const fetchIsNftMinted = async () => checkIfCharacterIsMinted()

  useEffect(() => {
    const handleCharacterState = async () => {
      const isNftMinted = await fetchIsNftMinted()

      if (isLoading) return
      if (character) {
        setIsModalOpen(false)
        setNavigateToCharacter(true)
      } else if (!isMinting && !character && isMinted && !isNftMinted) {
        const errorMsg =
          'Minting failed or the character could not be retrieved. Please try again or refresh the page.'
        setErrorMessage(errorMsg)
        addToast(errorMsg, 'error')
      } else if (isNftMinted && !character) {
        getCharacter()
        const errorMsg =
          'Character is already minted but could not be retrieved. Please try again or refresh the page.'
        setErrorMessage(errorMsg)
        addToast(errorMsg, 'error')
      }
    }

    handleCharacterState()
  }, [character, isLoading, isMinting, isMinted, addToast])

  const onCharacterChange = (id: number) => {
    setCharacterId(id)
  }

  if (!accountContext.connectedAccount) return <Navigate to="/" />

  if (navigateToCharacter) return <Navigate to={LEGENDS_ROUTES.character} />

  return (
    <>
      <NonV2Modal isOpen={!!accountContext.nonV2Account} />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Choose a Character</h1>
        <p className={styles.description}>
          Select your character, who will start at level 0. By completing quests and accumulating
          XP, you&apos;ll level up and climb the leaderboard.
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

        {isMinting && (
          <CharacterLoadingModal
            isOpen={isModalOpen}
            loadingMessage={loadingMessage}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </>
  )
}

export default CharacterSelect
