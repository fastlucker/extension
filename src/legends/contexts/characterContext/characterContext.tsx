import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import useAccountContext from '@legends/hooks/useAccountContext'
import { ethers } from 'ethers'

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

const LegendsNftAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'approved', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'operator', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: '_fromTokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: '_toTokenId', type: 'uint256' }
    ],
    name: 'BatchMetadataUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'MetadataUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'heroType', type: 'uint256' }],
    name: 'PickedCharacter',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' }
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'heroType', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes', name: '', type: 'bytes' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'bool', name: '', type: 'bool' }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'string', name: '_baseURI', type: 'string' }],
    name: 'setBaseUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' }
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'from', type: 'uint256' },
      { internalType: 'uint256', name: 'to', type: 'uint256' }
    ],
    name: 'updateOpenSeaInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

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

      const abi = LegendsNftAbi
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
          console.log({ receipt })
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
