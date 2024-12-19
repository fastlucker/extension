import { getAddress } from 'ethers'
import React, { FC, useMemo, useState } from 'react'

import useAddressInput from '@common/hooks/useAddressInput'
import useStandaloneAddressInput from '@common/hooks/useStandaloneAddressInput'
import AddressInput from '@legends/components/AddressInput'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useAccountContext from '@legends/hooks/useAccountContext'
import useToast from '@legends/hooks/useToast'
import { useInviteCard } from '@legends/modules/legends/hooks'
import { humanizeLegendsBroadcastError } from '@legends/modules/legends/utils/errors/humanizeBroadcastError'

import { useCardActionContext } from '../../../ActionModal/ActionModal'
import CardActionWrapper from './CardActionWrapper'

type Props = {
  buttonText: string
}

const SummonAcc: FC<Props> = ({ buttonText }) => {
  const { addToast } = useToast()
  const { onComplete, handleClose } = useCardActionContext()
  const { connectedAccount, allAccounts } = useAccountContext()

  const [isInProgress, setIsInProgress] = useState(false)

  const {
    address: v1OrEoaAddress,
    addressState,
    setAddressState,
    handleCacheResolvedDomain,
    setAddressStateKeyValue
  } = useStandaloneAddressInput()

  const overwriteErrorMessage = useMemo(() => {
    let checksummedAddress = ''

    try {
      checksummedAddress = getAddress(v1OrEoaAddress)
    } catch {
      return '' // There is validation for that in the useAddressInput hook
    }

    if (checksummedAddress === connectedAccount) {
      return 'You cannot invite your connected account.'
    }

    return ''
  }, [connectedAccount, v1OrEoaAddress])

  const overwriteSuccessMessage = useMemo(() => {
    let checksummedAddress = ''

    try {
      checksummedAddress = getAddress(v1OrEoaAddress)
    } catch {
      return ''
    }

    if (allAccounts.includes(checksummedAddress)) {
      return "The account you're trying to invite is imported in your wallet. You won't gain any additional XP by inviting it before taming it. You can directly tame your address using Beastwhisperer."
    }

    return ''
  }, [allAccounts, v1OrEoaAddress])

  const { validation } = useAddressInput({
    addressState,
    setAddressState: setAddressStateKeyValue,
    addToast,
    handleCacheResolvedDomain,
    overwriteError: overwriteErrorMessage,
    overwriteValidLabel: overwriteSuccessMessage
  })

  const { inviteEOA, switchNetwork } = useInviteCard({
    address: v1OrEoaAddress,
    setAddress: (address) => setAddressStateKeyValue({ fieldValue: address })
  })

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
      disabled={validation.isError || addressState.isDomainResolving}
      onButtonClick={onButtonClick}
    >
      <AddressInput
        addressState={addressState}
        setAddressState={setAddressState}
        validation={validation}
        label="Ambire v1 or Basic Account address"
      />
    </CardActionWrapper>
  )
}

export default SummonAcc
