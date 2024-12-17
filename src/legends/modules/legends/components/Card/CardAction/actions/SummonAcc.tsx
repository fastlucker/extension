import { getAddress } from 'ethers'
import React, { FC, useMemo, useState } from 'react'

import { isValidAddress } from '@ambire-common/services/address'
import Input from '@legends/components/Input'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useAccountContext from '@legends/hooks/useAccountContext'
import useToast from '@legends/hooks/useToast'
import { useInviteEOA } from '@legends/modules/legends/hooks'
import { humanizeLegendsBroadcastError } from '@legends/modules/legends/utils/errors/humanizeBroadcastError'

import CardActionWrapper from './CardActionWrapper'
import { CardProps } from './types'

type Props = CardProps & {
  buttonText: string
}

const SummonAcc: FC<Props> = ({ buttonText, handleClose, onComplete }) => {
  const { addToast } = useToast()
  const { connectedAccount, allAccounts } = useAccountContext()
  const {
    inviteEOA,
    switchNetwork,
    eoaAddress,
    setEoaAddress,
    isEOAAddressValid: isValid
  } = useInviteEOA()

  const [isInProgress, setIsInProgress] = useState(false)

  const inputValidation = useMemo(() => {
    if (!eoaAddress) return null
    const isAddressValid = isValidAddress(eoaAddress)

    if (!isAddressValid) {
      return {
        isValid: false,
        message: 'Invalid address.'
      }
    }

    let checksummedAddress = ''

    try {
      checksummedAddress = getAddress(eoaAddress)
    } catch {
      return {
        isValid: false,
        message: 'Invalid address checksum.'
      }
    }

    if (checksummedAddress === connectedAccount) {
      return {
        isValid: false,
        message: 'You cannot invite your connected account.'
      }
    }

    if (allAccounts.includes(checksummedAddress)) {
      return {
        isValid: true,
        message:
          "The account you're trying to invite is imported in your wallet. You won't gain any additional XP by inviting it before taming it. You can directly tame your address using Beastwhisperer."
      }
    }

    return {
      isValid,
      message: !isValid ? 'Invalid address' : ''
    }
  }, [allAccounts, connectedAccount, eoaAddress, isValid])

  const onButtonClick = async () => {
    try {
      await switchNetwork()
      setIsInProgress(true)
      const txnId = await inviteEOA()
      onComplete(txnId)
      handleClose()
    } catch (e: any) {
      const message = humanizeLegendsBroadcastError(e)

      addToast(message || ERROR_MESSAGES.transactionSigningFailed, { type: 'error' })
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
        label="EOA or Ambire v1 Address"
        placeholder="Enter an EOA or an Ambire v1 address"
        value={eoaAddress}
        validation={inputValidation}
        onChange={(e) => setEoaAddress(e.target.value)}
      />
    </CardActionWrapper>
  )
}

export default SummonAcc
