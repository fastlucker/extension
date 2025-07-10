import { Contract, JsonRpcProvider } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { LEGENDS_NFT_ADDRESS } from '@env'
import Spinner from '@legends/components/Spinner'
import { REWARDS_NFT_ADDRESS } from '@legends/constants/addresses'
import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

import blurredLights from './blurred-lights-wide.png'
import styles from './CharacterSelect.module.scss'
import CharacterLoadingModal from './components/CharacterLoadingModal'
import CharacterSlider from './components/CharacterSlider'
import useMintCharacter from './hooks/useMintCharacter'

const CharacterSelect = () => {
  const navigate = useNavigate()
  const [characterId, setCharacterId] = useState(1)
  const { connectedAccount, v1Account } = useAccountContext()
  const [errorMessage, setErrorMessage] = useState('')
  const [participatedInPreviousSeason, setParticipatedInPreviousSeason] = useState<boolean | null>(
    null
  )
  const [hasStartedMinting, setHasStartedMinting] = useState(false)

  const { character, isLoading } = useCharacterContext()
  const { isMinting, isMinted, loadingMessage, isCheckingMintStatus, mintCharacter } =
    useMintCharacter()

  useEffect(() => {
    if (isMinted) navigate(LEGENDS_ROUTES.home)
  }, [character, isMinted, connectedAccount, isLoading, isMinting, navigate])

  const onCharacterChange = (id: number) => {
    setCharacterId(id)
  }

  const redirectToCharacterPage = () => {
    navigate(LEGENDS_ROUTES.home)
  }

  useEffect(() => {
    document.title = 'Ambire Rewards'
  }, [])

  if (!!v1Account || !connectedAccount) {
    return <Navigate to="/" />
  }

  const isButtonDisabled = isMinting || isLoading || isMinted

  useEffect(() => {
    const baseProvider = new JsonRpcProvider('https://invictus.ambire.com/base')
    const ethereumProvider = new JsonRpcProvider('https://invictus.ambire.com/ethereum')
    const oldNft = new Contract(
      LEGENDS_NFT_ADDRESS,
      ['function balanceOf(address) public view returns(uint)'],
      baseProvider
    )
    const newNft = new Contract(
      REWARDS_NFT_ADDRESS,
      ['function balanceOf(address) public view returns(uint)'],
      ethereumProvider
    )
    Promise.all([oldNft.balanceOf(connectedAccount), newNft.balanceOf(connectedAccount)])
      .then(([hasOldNft, hasNewNft]: [bigint, bigint]) =>
        // since the user will see this screen only if he does not have
        // the nft from the current season, it is ok to not exclude the
        // current season's nft from the balanceOf() call from the new contract
        setParticipatedInPreviousSeason(!!hasOldNft || !!hasNewNft)
      )
      .catch((e) => console.log('Failed to get info about NFT balance', e))
  }, [connectedAccount])
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.backgroundEffect}
        style={{ backgroundImage: `url(${blurredLights})` }}
      />
      <div>
        <h1 className={styles.title}>Mint Your NFT</h1>
        <p className={styles.description}>
          {participatedInPreviousSeason
            ? "We are introducing new Ambire Rewards characters. Please pick one to replace your current character. This doesn't affect your XP or position on the Leaderboard."
            : 'Pick your profile avatar and mint a soulbound NFT for free'}
        </p>
      </div>

      <div>
        <CharacterSlider initialCharacterId={characterId} onCharacterChange={onCharacterChange} />
        {!isCheckingMintStatus && (
          <button
            onClick={() => {
              if (!isButtonDisabled) {
                setHasStartedMinting(true)
                mintCharacter(characterId).catch(() =>
                  setErrorMessage('We failed to fetch NFT info.')
                )
              }
            }}
            type="button"
            disabled={isButtonDisabled}
            className={styles.saveButton}
          >
            {isMinting ? 'Please wait...' : 'Mint NFT'}
          </button>
        )}
        {isCheckingMintStatus && <Spinner />}
      </div>

      <CharacterLoadingModal
        isOpen={
          hasStartedMinting &&
          // Currently minting
          (isMinting ||
            // Minted a short time ago and not caught by the relayer
            (isMinted && !character))
        }
        loadingMessage={loadingMessage}
        errorMessage={errorMessage}
        showOnMintModal={!!(character || (character && isMinted))}
        onButtonClick={redirectToCharacterPage}
      />
    </div>
  )
}

export default CharacterSelect
