import { BrowserProvider, Contract, getAddress, Interface } from 'ethers'
import React, { FC, useState } from 'react'

import { isValidAddress } from '@ambire-common/services/address'
import Input from '@legends/components/Input'
import { SUMMON_ABI } from '@legends/constants/abis/summon'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import useToast from '@legends/hooks/useToast'

import CardActionWrapper from './CardActionWrapper'

type Props = {
  buttonText: string
  onComplete: () => void
}

const SUMMON_INTERFACE = new Interface(SUMMON_ABI)

const SummonEOA: FC<Props> = ({ buttonText, onComplete }) => {
  const { addToast } = useToast()
  const [eoaAddress, setEoaAddress] = useState('')
  const [isInProgress, setIsInProgress] = useState(false)

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
      setIsInProgress(true)

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new Contract(LEGENDS_CONTRACT_ADDRESS, SUMMON_INTERFACE, signer)

      await contract.invite(checksummedAddress)

      addToast('Successfully invited EOA address', 'success')
      onComplete()
    } catch (e: any) {
      addToast('Failed to invite EOA address', 'error')
      console.error(e)
    } finally {
      setIsInProgress(false)
    }
  }

  const onButtonClick = async () => {
    await switchNetwork()
    await inviteEOA()
  }

  return (
    <CardActionWrapper
      isLoading={isInProgress}
      loadingText="Signing..."
      buttonText={buttonText}
      disabled={!isValid}
      onButtonClick={onButtonClick}
    >
      <Input
        label="EOA Address"
        placeholder="Enter EOA Address"
        value={eoaAddress}
        state={isValid || !eoaAddress ? 'default' : 'error'}
        onChange={(e) => setEoaAddress(e.target.value)}
      />
    </CardActionWrapper>
  )
}

export default SummonEOA
