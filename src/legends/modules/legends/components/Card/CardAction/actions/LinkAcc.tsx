/* eslint-disable no-console */
import { BrowserProvider, Interface, ZeroAddress } from 'ethers'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Legends as LEGENDS_CONTRACT_ABI } from '@ambire-common/libs/humanizer/const/abis/Legends'
import { isValidAddress } from '@ambire-common/services/address'
import ConfettiAnimation from '@common/modules/dashboard/components/ConfettiAnimation'
import Alert from '@legends/components/Alert'
import Input from '@legends/components/Input'
import Stepper from '@legends/components/Stepper'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'

import styles from './Action.module.scss'
import CardActionWrapper from './CardActionWrapper'

type Props = {
  onComplete: () => void
}

enum STEPS {
  SIGN_MESSAGE,
  SIGN_TRANSACTION,
  SUCCESS
}

const BUTTON_TEXT = {
  [STEPS.SIGN_MESSAGE]: 'Sign message',
  [STEPS.SIGN_TRANSACTION]: 'Sign transaction',
  [STEPS.SUCCESS]: 'Close'
}

const STEPPER_STEPS = [
  'Sign a message with the Basic or v1 account you want to link',
  'Sign a transaction with your v2 account'
]

const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

const LinkAcc: FC<Props> = ({ onComplete }) => {
  const [isInProgress, setIsInProgress] = useState(false)
  const [v1OrBasicSignature, setV1OrBasicSignature] = useState('')
  const [messageSignedForV2Account, setMessageSignedForV2Account] = useState('')
  const [v1OrEoaAddress, setV1OrEoaAddress] = useState('')
  const [isFlowComplete, setIsFlowComplete] = useState(false)
  const { sendCalls, getCallsStatus, chainId } = useErc5792()

  const { addToast } = useToast()
  const { connectedAccount, setAllowNonV2Connection } = useAccountContext()
  const switchNetwork = useSwitchNetwork()

  const inputValidation = useMemo(() => {
    if (!v1OrEoaAddress) return null
    const isAddressValid = isValidAddress(v1OrEoaAddress)

    return {
      isValid: isAddressValid,
      message: !isAddressValid ? 'Invalid address' : ''
    }
  }, [v1OrEoaAddress])

  const activeStep = useMemo(() => {
    if (isFlowComplete) return STEPS.SUCCESS
    if (v1OrBasicSignature) return STEPS.SIGN_TRANSACTION

    return STEPS.SIGN_MESSAGE
  }, [isFlowComplete, v1OrBasicSignature])

  const isActionEnabled = useMemo(() => {
    if (activeStep === STEPS.SIGN_MESSAGE) {
      return !!inputValidation?.isValid
    }
    if (activeStep === STEPS.SIGN_TRANSACTION) {
      return messageSignedForV2Account === connectedAccount
    }

    return activeStep === STEPS.SUCCESS
  }, [activeStep, inputValidation?.isValid, messageSignedForV2Account, connectedAccount])

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
      setIsInProgress(true)
      const signature = await window.ambire.request({
        method: 'personal_sign',
        params: [`Assign ${v1OrEoaAddress} to Ambire Legends ${connectedAccount}`, v1OrEoaAddress]
      })
      setMessageSignedForV2Account(connectedAccount!)

      if (typeof signature !== 'string') throw new Error('Invalid signature')

      setV1OrBasicSignature(signature)
    } catch (e) {
      console.error(e)
      addToast('Failed to sign message', 'error')
    } finally {
      setIsInProgress(false)
    }
  }, [addToast, connectedAccount, v1OrEoaAddress])

  const sendV2Transaction = useCallback(async () => {
    try {
      if (!connectedAccount) throw new Error('No connected account')

      setIsInProgress(true)
      const provider = new BrowserProvider(window.ethereum)
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
      if (receipt.status !== '0x1') throw new Error('Failed linking')

      addToast('Successfully linked accounts', 'success')
      setIsFlowComplete(true)
    } catch (e) {
      console.error(e)
      addToast('Failed to sign transaction', 'error')
      setIsFlowComplete(false)
    } finally {
      setIsInProgress(false)
    }
  }, [
    connectedAccount,
    v1OrEoaAddress,
    v1OrBasicSignature,
    addToast,
    sendCalls,
    getCallsStatus,
    chainId
  ])

  const onButtonClick = useCallback(async () => {
    if (activeStep === STEPS.SUCCESS) {
      onComplete()
      setAllowNonV2Connection(false)
      return
    }
    await switchNetwork()

    if (activeStep === STEPS.SIGN_MESSAGE) {
      await signV1OrBasicAccountMessage()
    } else if (activeStep === STEPS.SIGN_TRANSACTION) {
      await sendV2Transaction()
    }
  }, [
    switchNetwork,
    activeStep,
    signV1OrBasicAccountMessage,
    sendV2Transaction,
    onComplete,
    setAllowNonV2Connection
  ])

  return (
    <CardActionWrapper
      isLoading={isInProgress}
      loadingText="Signing..."
      disabled={!isActionEnabled}
      buttonText={BUTTON_TEXT[activeStep]}
      onButtonClick={onButtonClick}
    >
      <Stepper activeStep={activeStep} steps={STEPPER_STEPS} className={styles.stepper} />
      {activeStep === STEPS.SIGN_TRANSACTION && !isActionEnabled && (
        <Alert
          type="warning"
          title="You have connected a wrong account"
          message={`Please connect ${messageSignedForV2Account} to continue`}
        />
      )}

      {activeStep === STEPS.SIGN_MESSAGE && (
        <Input
          label="Ambire v1 or Basic Account address"
          placeholder="0x..."
          value={v1OrEoaAddress}
          validation={inputValidation}
          onChange={(e) => setV1OrEoaAddress(e.target.value)}
        />
      )}
      {activeStep === STEPS.SUCCESS && (
        <>
          <p>
            🎉 Your Basic or v1 account has been successfully linked to your v2 account! Visit the
            character page to check your earned XP.
          </p>
          <ConfettiAnimation width={650} height={500} autoPlay className={styles.confetti} />
        </>
      )}
    </CardActionWrapper>
  )
}

export default LinkAcc
