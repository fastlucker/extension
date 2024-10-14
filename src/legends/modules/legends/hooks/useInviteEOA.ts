import { BrowserProvider, Contract, getAddress, Interface } from 'ethers'
import { useState } from 'react'

import { isValidAddress } from '@ambire-common/services/address'
import { LEGENDS_CONTRACT_ABI } from '@legends/constants/abis/legends'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import useToast from '@legends/hooks/useToast'

const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

const useInviteEOA = () => {
  const { addToast } = useToast()
  const [eoaAddress, setEoaAddress] = useState('')

  const isValid = isValidAddress(eoaAddress)

  const switchNetwork = async () => {
    // Request a chain change to base and a sign message to associate the EOA address
    try {
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }]
      })
    } catch {
      addToast('Failed to switch to Base Network', 'error')
    }
  }

  const inviteEOA = async () => {
    const checksummedAddress = getAddress(eoaAddress)

    try {
      setEoaAddress('')

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new Contract(LEGENDS_CONTRACT_ADDRESS, LEGENDS_CONTRACT_INTERFACE, signer)

      await contract.invite(checksummedAddress)
    } catch (e: any) {
      addToast('Failed to invite EOA address', 'error')
      console.error(e)
    }
  }

  return {
    inviteEOA,
    switchNetwork,
    eoaAddress,
    setEoaAddress,
    isEOAAddressValid: isValid
  }
}

export default useInviteEOA
