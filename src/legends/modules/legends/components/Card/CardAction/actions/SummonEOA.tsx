import React, { FC, useState } from 'react'

import Input from '@legends/components/Input'
import useToast from '@legends/hooks/useToast'
import { useInviteEOA } from '@legends/modules/legends/hooks'

import CardActionWrapper from './CardActionWrapper'

type Props = {
  buttonText: string
  onComplete: () => void
}

const SummonEOA: FC<Props> = ({ buttonText, onComplete }) => {
  const { addToast } = useToast()
  const {
    inviteEOA,
    switchNetwork,
    eoaAddress,
    setEoaAddress,
    isEOAAddressValid: isValid
  } = useInviteEOA()
  const [isInProgress, setIsInProgress] = useState(false)

  const onButtonClick = async () => {
    try {
      await switchNetwork()
      setIsInProgress(true)
      await inviteEOA()
      addToast('Successfully invited EOA address', 'success')
      onComplete()
    } catch (e: any) {
      addToast('Failed to invite EOA address', 'error')
      console.error(e)
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
