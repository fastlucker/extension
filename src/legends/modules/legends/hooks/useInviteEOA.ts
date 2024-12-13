import { BrowserProvider, getAddress, Interface } from 'ethers'
import { useState } from 'react'

import { Legends as LEGENDS_CONTRACT_ABI } from '@ambire-common/libs/humanizer/const/abis/Legends'
import { isValidAddress } from '@ambire-common/services/address'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import useErc5792 from '@legends/hooks/useErc5792'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'

const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

const useInviteEOA = () => {
  const switchNetwork = useSwitchNetwork()
  const [eoaAddress, setEoaAddress] = useState('')
  const { sendCalls, getCallsStatus, chainId } = useErc5792()

  const isValid = isValidAddress(eoaAddress)

  const inviteEOA = async (): Promise<string> => {
    setEoaAddress('')
    const checksummedAddress = getAddress(eoaAddress)

    setEoaAddress('')

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    // no sponsorship for inviteEOA
    const useSponsorship = false

    const sendCallsIdentifier = await sendCalls(
      chainId,
      await signer.getAddress(),
      [
        {
          to: LEGENDS_CONTRACT_ADDRESS,
          data: LEGENDS_CONTRACT_INTERFACE.encodeFunctionData('invite', [checksummedAddress])
        }
      ],
      useSponsorship
    )
    const receipt = await getCallsStatus(sendCallsIdentifier)

    return receipt.transactionHash
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
