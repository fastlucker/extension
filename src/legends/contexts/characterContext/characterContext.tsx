import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import useAccountContext from '@legends/hooks/useAccountContext'
import { ethers } from 'ethers'
import LegendsNFT from '@contracts/compiled/LegendsNft.json'

const RELAYER_URL = 'https://staging-relayer.ambire.com'

const CharacterContext = createContext<{
  character?: any
  getCharacter: () => void
  mintCharacter: (type: number) => void
  isMinting: boolean
}>({
  getCharacter: () => {},
  mintCharacter: () => {},
  isMinting: false
})

const CharacterContextProvider: React.FC<any> = ({ children }) => {
  const { connectedAccount } = useAccountContext()
  const [character, setCharacter] = useState<any>()
  const [isMinting, setIsMinting] = useState(false)

  const getCharacter = useCallback(async () => {
    if (!connectedAccount) return

    const characterResponse = await fetch(`${RELAYER_URL}/legends/nft-meta/${connectedAccount}`)
    setCharacter(await characterResponse.json())
  }, [connectedAccount])

  const mintCharacter = useCallback(
    async (type: number) => {
      if (!connectedAccount || !window.ambire) return

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
    [connectedAccount, getCharacter]
  )

  useEffect(() => {
    if (!connectedAccount) return
    getCharacter()
  }, [connectedAccount, getCharacter])

  return (
    <CharacterContext.Provider
      value={useMemo(
        () => ({
          character,
          getCharacter,
          mintCharacter,
          isMinting
        }),
        [character, getCharacter, mintCharacter, isMinting]
      )}
    >
      {children}
    </CharacterContext.Provider>
  )
}

export { CharacterContextProvider, CharacterContext }
