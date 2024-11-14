import { ethers } from 'ethers'
import { useCallback, useState } from 'react'

import LegendsNFT from '@contracts/compiled/LegendsNft.json'
import { LEGENDS_NFT_ADDRESS } from '@env'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import useToast from '@legends/hooks/useToast'

enum CharacterLoadingMessage {
  Initial = 'Initializing character setup...',
  Signing = 'Connecting to the blockchain, please sign your transaction so we can proceed',
  Minting = 'Securing NFT...',
  Minted = 'Finalizing details...'
}

const useMintCharacter = () => {
  const { addToast } = useToast()

  const { getCharacter, character } = useCharacterContext()

  const [isMinting, setIsMinting] = useState(null)
  const [isMintedDate, setIsMintedDate] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState<CharacterLoadingMessage>(
    CharacterLoadingMessage.Initial
  )

  const checkIfCharacterIsMinted = useCallback(async () => {
    const provider = new ethers.BrowserProvider(window.ambire)

    const signer = await provider.getSigner()

    const abi = LegendsNFT.abi
    const nftContract = new ethers.Contract(LEGENDS_NFT_ADDRESS, abi, signer)

    try {
      // Check if the user already owns an NFT
      const characterMinted = await nftContract.balanceOf(signer.getAddress())
      return characterMinted > 0
    } catch (e) {
      console.error('Error checking mint status:', e)
      return false
    }
  }, [])

  // The transaction may be confirmed but the relayer may not have updated the character's metadata yet.
  const pollForCharacterAfterMint = useCallback(async () => {
    const interval = setInterval(() => {
      if (character && character?.characterType !== 'unknown') {
        clearInterval(interval)
        return
      }
      getCharacter()
    }, 1000)

    return () => clearInterval(interval)
  }, [character, getCharacter])

  const mintCharacter = useCallback(
    async (type: number) => {
      // Switch to Base chain
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }] // chainId must be in hexadecimal numbers
      })

      setIsMinting(true)
      setLoadingMessage(CharacterLoadingMessage.Signing)

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
        setLoadingMessage(CharacterLoadingMessage.Minting)

        if (receipt.status === 1) {
          setLoadingMessage(CharacterLoadingMessage.Minted)
          setIsMintedDate(Date.now())
          // Transaction was successful, call getCharacter
          await pollForCharacterAfterMint()

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
    [addToast, setIsMintedDate, pollForCharacterAfterMint]
  )
  return {
    isMinting,
    isMintedDate,
    loadingMessage,
    mintCharacter,
    checkIfCharacterIsMinted
  }
}

export default useMintCharacter
