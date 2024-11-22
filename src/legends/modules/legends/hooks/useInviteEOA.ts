import { BrowserProvider, Contract, getAddress, Interface } from 'ethers'
import { useState } from 'react'

import { Legends as LEGENDS_CONTRACT_ABI } from '@ambire-common/libs/humanizer/const/abis/Legends'
import { isValidAddress } from '@ambire-common/services/address'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'

const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

const useInviteEOA = () => {
  const switchNetwork = useSwitchNetwork()
  const [eoaAddress, setEoaAddress] = useState('')

  const isValid = isValidAddress(eoaAddress)

  const inviteEOA = async () => {
    setEoaAddress('')
    const checksummedAddress = getAddress(eoaAddress)

    setEoaAddress('')

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(LEGENDS_CONTRACT_ADDRESS, LEGENDS_CONTRACT_INTERFACE, signer)

    await contract.invite(checksummedAddress)
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
