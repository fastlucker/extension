/* eslint-disable no-console */
import { BrowserProvider, getAddress, Interface, ZeroAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Legends as LEGENDS_CONTRACT_ABI } from '@ambire-common/libs/humanizer/const/abis/Legends'
import useAddressInput from '@common/hooks/useAddressInput'
import useStandaloneAddressInput from '@common/hooks/useStandaloneAddressInput'
import HumanReadableError from '@legends/classes/HumanReadableError'
import Accordion from '@legends/components/Accordion'
import Address from '@legends/components/Address'
import AddressInput from '@legends/components/AddressInput'
import Alert from '@legends/components/Alert'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'
import { useCardActionContext } from '@legends/modules/legends/components/ActionModal'
import { humanizeError } from '@legends/modules/legends/utils/errors/humanizeError'

import CardActionWrapper from './CardActionWrapper'
import styles from './LinkAcc.module.scss'

enum STEPS {
  UNUSED,
  SIGN_MESSAGE,
  SIGN_TRANSACTION
}

const BUTTON_TEXT: {
  [key: number]: string
} = {
  // The first step is a guide for the user to add their account, so we can't set an active
  // step until the user proceeds to the next step
  [STEPS.UNUSED]: 'Only used for guidance',
  [STEPS.SIGN_MESSAGE]: 'Sign message',
  [STEPS.SIGN_TRANSACTION]: 'Sign transaction'
}

const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

interface Props {
  alreadyLinkedAccounts: string[]
  accountLinkingHistory: { invitedEoaOrV1: string; date: string }[]
}
const LinkAcc = ({ alreadyLinkedAccounts = [], accountLinkingHistory = [] }: Props) => {
  const { addToast } = useToast()
  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const {
    onComplete,
    handleClose,
    activeStep: nullableActiveStep,
    setActiveStep
  } = useCardActionContext()
  // Active step can be null because there are legends that don't activate the stepper
  const activeStep = nullableActiveStep || STEPS.SIGN_MESSAGE
  const switchNetwork = useSwitchNetwork()
  const { connectedAccount, allAccounts, setAllowNonV2Connection } = useAccountContext()

  const [isInProgress, setIsInProgress] = useState(false)
  const [v1OrBasicSignature, setV1OrBasicSignature] = useState('')
  const [messageSignedForV2Account, setMessageSignedForV2Account] = useState('')

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
      return 'You cannot link your connected account.'
    }

    if (!allAccounts.includes(checksummedAddress)) {
      return 'You cannot link an account that is not in your wallet.'
    }

    if (alreadyLinkedAccounts.includes(checksummedAddress)) {
      return 'This account has already been linked'
    }

    return ''
  }, [allAccounts, connectedAccount, v1OrEoaAddress, alreadyLinkedAccounts])

  const { validation } = useAddressInput({
    addressState,
    setAddressState: setAddressStateKeyValue,
    addToast,
    handleCacheResolvedDomain,
    overwriteError: overwriteErrorMessage
  })

  const isActionEnabled = useMemo(() => {
    if (activeStep === STEPS.SIGN_MESSAGE) {
      return !validation?.isError && !addressState.isDomainResolving
    }

    return messageSignedForV2Account === connectedAccount
  }, [
    activeStep,
    messageSignedForV2Account,
    connectedAccount,
    validation?.isError,
    addressState.isDomainResolving
  ])

  useEffect(() => {
    if (v1OrBasicSignature) return setActiveStep(2)
  }, [setActiveStep, v1OrBasicSignature])

  // We don't allow non-v2 accounts to connect to Legends,
  // except when the user needs to link an EOA/v1 account to their main v2 account.
  // Therefore, we add this exception here, setting the `allowNonV2Connection` flag to true.
  // Upon unmounting, we disallow it again.
  useEffect(() => {
    setAllowNonV2Connection(true)

    return () => {
      setAllowNonV2Connection(false)
    }
  }, [setAllowNonV2Connection])

  const signV1OrBasicAccountMessage = useCallback(async () => {
    if (!v1OrEoaAddress) return

    try {
      if (!connectedAccount) throw new HumanReadableError('No connected account')

      setIsInProgress(true)
      const signature = await window.ambire.request({
        method: 'personal_sign',
        params: [`Assign ${v1OrEoaAddress} to Ambire Legends ${connectedAccount}`, v1OrEoaAddress]
      })
      setMessageSignedForV2Account(connectedAccount)

      if (typeof signature !== 'string') throw new HumanReadableError('Invalid signature')

      setV1OrBasicSignature(signature)
    } catch (e) {
      const message = humanizeError(e, ERROR_MESSAGES.messageSigningFailed)
      console.error(e)
      addToast(message, { type: 'error' })
    } finally {
      setIsInProgress(false)
    }
  }, [addToast, connectedAccount, v1OrEoaAddress])

  const sendV2Transaction = useCallback(async () => {
    try {
      if (!connectedAccount) throw new HumanReadableError('No connected account')

      setIsInProgress(true)
      const provider = new BrowserProvider(window.ambire)
      const signer = await provider.getSigner(connectedAccount)

      // no sponsorship for linkAcc
      const useSponsorship = false

      const sendCallsIdentifier = await sendCalls(
        chainId,
        await signer.getAddress(),
        [
          {
            to: LEGENDS_CONTRACT_ADDRESS,
            data: LEGENDS_CONTRACT_INTERFACE.encodeFunctionData('linkAndAcceptInvite', [
              connectedAccount,
              v1OrEoaAddress,
              ZeroAddress,
              v1OrBasicSignature
            ])
          }
        ],
        useSponsorship
      )
      const receipt = await getCallsStatus(sendCallsIdentifier)

      onComplete(receipt.transactionHash)
      handleClose()
    } catch (e: any) {
      const message = humanizeError(e, ERROR_MESSAGES.transactionSigningFailed)

      console.error(e)
      addToast(message, { type: 'error' })

      setAllowNonV2Connection(false)
    } finally {
      setIsInProgress(false)
    }
  }, [
    connectedAccount,
    sendCalls,
    chainId,
    v1OrEoaAddress,
    v1OrBasicSignature,
    getCallsStatus,
    onComplete,
    handleClose,
    addToast,
    setAllowNonV2Connection
  ])

  const onButtonClick = useCallback(async () => {
    await switchNetwork()

    if (activeStep === STEPS.SIGN_MESSAGE) {
      await signV1OrBasicAccountMessage()
    } else if (activeStep === STEPS.SIGN_TRANSACTION) {
      await sendV2Transaction()
    }
  }, [activeStep, switchNetwork, signV1OrBasicAccountMessage, sendV2Transaction])

  return (
    <CardActionWrapper
      isLoading={isInProgress}
      loadingText="Signing..."
      disabled={!isActionEnabled}
      buttonText={BUTTON_TEXT[activeStep]}
      onButtonClick={onButtonClick}
    >
      {activeStep === STEPS.SIGN_TRANSACTION && !isActionEnabled && (
        <Alert
          type="warning"
          title="You have connected a wrong account"
          message={`Please connect ${messageSignedForV2Account} to continue`}
        />
      )}

      {activeStep === STEPS.SIGN_MESSAGE && (
        <AddressInput
          addressState={addressState}
          setAddressState={setAddressState}
          validation={validation}
          label="Ambire v1 or Basic Account address"
        />
      )}
      <Accordion
        title={
          accountLinkingHistory.length
            ? `Successfully linked accounts (${accountLinkingHistory.length})`
            : 'No linked accounts yet'
        }
        expandable={!!accountLinkingHistory.length}
      >
        <div className={`${styles.scrollableHistory}`}>
          {accountLinkingHistory.map(({ invitedEoaOrV1, date }) => (
            <div className={`${styles.invitationItem}`} key={invitedEoaOrV1}>
              <Address className={`${styles.address}`} address={invitedEoaOrV1} />
              <div className={`${styles.timeAgo}`}>
                {new Date(date).toLocaleString([], {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      </Accordion>
    </CardActionWrapper>
  )
}

export default LinkAcc
