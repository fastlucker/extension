import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Alert from '@legends/components/Alert'
import NonV2Modal from '@legends/components/NonV2Modal'
import Spinner from '@legends/components/Spinner'
import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

import styles from './CharacterSelect.module.scss'
import CharacterLoadingModal from './components/CharacterLoadingModal'
import CharacterSlider from './components/CharacterSlider'
import useMintCharacter from './hooks/useMintCharacter'

const CharacterSelect = () => {
  const navigate = useNavigate()
  const [characterId, setCharacterId] = useState(1)
  const accountContext = useAccountContext()
  const [errorMessage, setErrorMessage] = useState('')

  const { character, isLoading } = useCharacterContext()
  const { isMinting, mintedAt, isMinted, loadingMessage, isCheckingMintStatus, mintCharacter } =
    useMintCharacter()
  const isMintedAndNotCaughtByRelayer =
    isMinted && !character && !isLoading && mintedAt === 'past-block-watch'

  useEffect(() => {
    if (character) {
      navigate(LEGENDS_ROUTES.character)
      return
    }

    if (isMintedAndNotCaughtByRelayer) {
      setErrorMessage(
        'Character is already minted but could not be retrieved. Please try again or refresh the page.'
      )
    }
  }, [character, isLoading, isMintedAndNotCaughtByRelayer, isMinting, navigate])

  const onCharacterChange = (id: number) => {
    setCharacterId(id)
  }

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
        {isMintedAndNotCaughtByRelayer && !isCheckingMintStatus && (
          <Alert
            type="error"
            title="Character is already minted"
            message="Character is already minted but could not be retrieved. Please contact Ambire support."
          />
        )}
        {!isMintedAndNotCaughtByRelayer && !isCheckingMintStatus && (
          <button
            onClick={() => mintCharacter(characterId)}
            type="button"
            disabled={isMinting || isLoading || isMinted}
            className={styles.saveButton}
          >
            {isMinting ? 'Please wait...' : 'Select'}
          </button>
        )}
        {isCheckingMintStatus && <Spinner />}

        {!isCheckingMintStatus && (
          <CharacterLoadingModal
            isOpen={
              // Currently minting
              isMinting ||
              // Minted a short time ago and not caught by the relayer
              (isMinted && !character && !isMintedAndNotCaughtByRelayer)
            }
            loadingMessage={loadingMessage}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </>
  )
}

export default CharacterSelect
