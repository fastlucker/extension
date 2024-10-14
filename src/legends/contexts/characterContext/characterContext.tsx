import { ethers } from 'ethers'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import LegendsNFT from '@contracts/compiled/LegendsNft.json'
import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'

type Character = {
  characterType: 'unknown' | 'slime' | 'sorceress' | 'necromancer' | 'penguin'
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
}>({
  character: null,
  getCharacter: () => {},
  mintCharacter: () => {},
  isLoading: false,
  isMinting: false
})

const CharacterContextProvider: React.FC<any> = ({ children }) => {
  const { lastConnectedV2Account, isConnectedAccountV2 } = useAccountContext()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  const getCharacter = useCallback(async () => {
    if (!lastConnectedV2Account) {
      setCharacter(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setCharacter(null)

    const characterResponse = await fetch(
      `${RELAYER_URL}/legends/nft-meta/${lastConnectedV2Account}`
    )

    setIsLoading(false)
    setCharacter(await characterResponse.json())
  }, [lastConnectedV2Account])

  const mintCharacter = useCallback(
    async (type: number) => {
      if (!isConnectedAccountV2 || !window.ambire) return

      // Switch to Base chain
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }] // chainId must be in hexadecimal numbers
      })

      setIsMinting(true)

      const provider = new ethers.BrowserProvider(window.ambire)

      const signer = await provider.getSigner()

      const abi = LegendsNFT.abi
      const contractAddress = '0x52d067EBB7b06F31AEB645Bd34f92c3Ac13a29ea'

      // Create a contract instance
      const nftContract = new ethers.Contract(contractAddress, abi, signer)

      // TODO: Keep the error in the state and render it in a component
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
          alert('Error selecting a character: The transaction failed!')
        }
      } catch (error) {
        setIsMinting(false)
        alert('Error during minting process!')
        console.log('Error during minting process:', error)
      }
    },
    [isConnectedAccountV2, getCharacter]
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
          isMinting
        }),
        [character, getCharacter, mintCharacter, isLoading, isMinting]
      )}
    >
      {children}
    </CharacterContext.Provider>
  )
}

export { CharacterContextProvider, CharacterContext }
