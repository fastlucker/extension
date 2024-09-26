import { ethers } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

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

const RELAYER_URL = 'https://staging-relayer.ambire.com'

const Character = () => {
  const [isMinted, setIsMinted] = useState()
  const [character, setCharacter] = useState()
  const { accountPortfolio } = usePortfolioControllerState()

  // This won't be needed, as `/legends/nft-meta/${accountPortfolio?.address}` will be refactored and will return that info
  useEffect(() => {
    ;(async () => {
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }] // chainId must be in hexadecimal numbers
      })

      const abi = LegendsNftAbi
      const contractAddress = '0x52d067EBB7b06F31AEB645Bd34f92c3Ac13a29ea'
      const provider = new ethers.BrowserProvider(window.ambire)
      const signer = await provider.getSigner()

      // Create a contract instance
      const myNftContract = new ethers.Contract(contractAddress, abi, signer)

      try {
        const owner = await myNftContract.owner()
        setIsMinted(true)
      } catch (e: any) {
        console.log({ e })
        setIsMinted(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!isMinted || character) return
    ;(async () => {
      const nftMeta = await fetch(`${RELAYER_URL}/legends/nft-meta/${accountPortfolio?.address}`)
      setCharacter(nftMeta)
    })()
  }, [isMinted, accountPortfolio, character])

  const mintCharacter = useCallback(async (event) => {
    await window.ambire.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }] // chainId must be in hexadecimal numbers
    })

    const provider = new ethers.BrowserProvider(window.ambire)

    const signer = await provider.getSigner()

    const abi = LegendsNftAbi
    const contractAddress = '0x52d067EBB7b06F31AEB645Bd34f92c3Ac13a29ea'

    // Create a contract instance
    const myNftContract = new ethers.Contract(contractAddress, abi, signer)

    await myNftContract.mint(signer.address)
  }, [])

  // Loading the contract
  if (isMinted === undefined) {
    return <div />
  }

  if (isMinted) {
    return (
      <div>
        You already choose a Character
        {character && character.toString()}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      <label>
        <strong>Choose Character</strong>
      </label>
      <select onChange={mintCharacter}>
        <option value={1}>Character 1</option>
        <option value={2}>Character 2</option>
        <option value={3}>Character 3</option>
      </select>
    </div>
  )
}

export default Character
