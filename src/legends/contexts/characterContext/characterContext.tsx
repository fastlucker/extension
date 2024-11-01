import { ethers } from 'ethers'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import LegendsNFT from '@contracts/compiled/LegendsNft.json'
import { LEGENDS_NFT_ADDRESS, RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'
import useToast from '@legends/hooks/useToast'

console.log(RELAYER_URL)

type Character = {
  characterType: 'unknown' | 'slime' | 'sorceress' | 'necromancer' | 'penguin'
  characterName: string
  name: string
  description: string
  level: number
  xp: number
  image: string
  image_avatar: string
}

const CharacterContext = createContext<{
  character: Character | null
  getCharacter: () => void
  mintCharacter: (type: number) => void
  isLoading: boolean
  isMinting: boolean
  error: string | null
}>({
  character: null,
  getCharacter: () => {},
  mintCharacter: () => {},
  isLoading: false,
  isMinting: false,
  error: null
})

const CharacterContextProvider: React.FC<any> = ({ children }) => {
  const { connectedAccount } = useAccountContext()
  const { addToast } = useToast()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  // In case of this error, a global <ErrorPage /> will be rendered in place of all other components,
  // as loading a character is crucial for playing in Legends.
  const [error, setError] = useState<string | null>(null)

  const getCharacter = useCallback(async () => {
    if (!connectedAccount) {
      setCharacter(null)
      setIsLoading(false)
      return
    }

    try {
      const characterResponse = await fetch(
        `${RELAYER_URL}/legends/nft-meta/${connectedAccount}`
      )

      const characterJson = await characterResponse.json()

      setCharacter(characterJson as Character)
      setError(null)
    } catch (e) {
      setError(`Couldn't load the requested character: ${connectedAccount}`)
      console.error(e)
    }

    setIsLoading(false)
  }, [connectedAccount])

  const mintCharacter = useCallback(
    async (type: number) => {
      // Switch to Base chain
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }] // chainId must be in hexadecimal numbers
      })

      setIsMinting(true)

      const provider = new ethers.BrowserProvider(window.ambire)

      const signer = await provider.getSigner()

      const abi = LegendsNFT.abi

      // Create a contract instance
      const nftContract = new ethers.Contract(LEGENDS_NFT_ADDRESS, abi, signer)

      try {
        // Call the mint function and wait for the transaction response
        const tx = await nftContract.mint(type)

        // Wait for the transaction to be mined
        const receipt = await tx.wait()

        if (receipt.status === 1) {
          // Transaction was successful, call getCharacter
          await getCharacter()
          setIsMinting(false)
        } else {
          addToast('Error selecting a character: The transaction failed!', 'error')
        }
      } catch (e) {
        setIsMinting(false)
        addToast('Error during minting process!', 'error')
        console.log('Error during minting process:', e)
      }
    },
    [getCharacter]
  )

  useEffect(() => {
    getCharacter()
  }, [getCharacter])

  return (
    <CharacterContext.Provider
      value={useMemo(
        () => ({
          character,
          getCharacter,
          mintCharacter,
          isLoading,
          isMinting,
          error
        }),
        [character, getCharacter, mintCharacter, isLoading, isMinting, error]
      )}
    >
      {children}
    </CharacterContext.Provider>
  )
}

export { CharacterContextProvider, CharacterContext }
