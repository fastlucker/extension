import { getAddress } from 'ethers'
import React, { FC, useState } from 'react'

import { isValidAddress } from '@ambire-common/services/address'
import Input from '@legends/components/Input'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import useAccountContext from '@legends/hooks/useAccountContext'

import CardActionWrapper from './CardActionWrapper'

type Props = {
  buttonText: string
  onComplete: () => void
}

const SummonEOA: FC<Props> = ({ buttonText, onComplete }) => {
  const { connectedAccount } = useAccountContext()
  const [eoaAddress, setEoaAddress] = useState('')
  const [isInProgress, setIsInProgress] = useState(false)

  const isValid = isValidAddress(eoaAddress)

  const onButtonClick = async () => {
    // Request a chain change to base and a sign message to associate the EOA address
    try {
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }]
      })
    } catch {
      // TODO: Replace with toast
      alert('Failed to switch chain')
    }
    const checksummedAddress = getAddress(eoaAddress)

    try {
      setEoaAddress('')
      setIsInProgress(true)
      await window.ambire.request({
        method: 'personal_sign',
        params: [`Assign to Ambire Legends ${checksummedAddress}`, connectedAccount]
      })
      // TODO: Replace with toast
      alert('EOA address assigned successfully')
      onComplete()
    } catch {
      // TODO: Replace with toast
      alert('Failed to sign message')
    } finally {
      setIsInProgress(false)
    }
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
