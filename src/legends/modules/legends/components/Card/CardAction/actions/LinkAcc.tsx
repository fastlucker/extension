import { BrowserProvider, Contract, Interface, ZeroAddress } from 'ethers'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Legends as LEGENDS_CONTRACT_ABI } from '@ambire-common/libs/humanizer/const/abis/Legends'
import Alert from '@legends/components/Alert'
import Stepper from '@legends/components/Stepper'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import useAccountContext from '@legends/hooks/useAccountContext'
import useToast from '@legends/hooks/useToast'

import styles from './Action.module.scss'
import CardActionWrapper from './CardActionWrapper'

type Props = {
  onComplete: () => void
}

enum STEPS {
  CONNECT_V1_OR_BASIC_ACCOUNT,
  SIGN_MESSAGE,
  CONNECT_V2_ACCOUNT,
  SIGN_TRANSACTION
}

const BUTTON_TEXT = {
  [STEPS.CONNECT_V1_OR_BASIC_ACCOUNT]: 'Connect a v1/Basic Account',
  [STEPS.SIGN_MESSAGE]: 'Sign message',
  [STEPS.CONNECT_V2_ACCOUNT]: 'Connect your v2 account again',
  [STEPS.SIGN_TRANSACTION]: 'Sign transaction'
}

const STEPPER_STEPS = [
  'Connect a v1/basic account',
  'Sign a message',
  'Connect your v2 account again',
  'Sign a transaction'
]

const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

const LinkAcc: FC<Props> = ({ onComplete }) => {
  const { connectedAccount, nonV2Account, setAllowNonV2Connection } = useAccountContext()
  const { addToast } = useToast()
  const [isInProgress, setIsInProgress] = useState(false)
  const [v1OrBasicSignature, setV1OrBasicSignature] = useState('')
  const [messageSignedForV2Account, setMessageSignedForV2Account] = useState('')
  const [v1OrEoaAddress, setV1OrEoaAddress] = useState('')
  const activeStep = useMemo(() => {
    if (v1OrBasicSignature && !nonV2Account) return STEPS.SIGN_TRANSACTION
    if (v1OrBasicSignature) return STEPS.CONNECT_V2_ACCOUNT
    if (nonV2Account && !v1OrBasicSignature) return STEPS.SIGN_MESSAGE

    return STEPS.CONNECT_V1_OR_BASIC_ACCOUNT
  }, [nonV2Account, v1OrBasicSignature])

  const isActionEnabled = useMemo(() => {
    if (activeStep === STEPS.SIGN_MESSAGE) {
      return nonV2Account
    }
    if (activeStep === STEPS.SIGN_TRANSACTION) {
      return messageSignedForV2Account === connectedAccount
    }

    return false
  }, [activeStep, nonV2Account, messageSignedForV2Account, connectedAccount])

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

  const changeNetworkToBase = useCallback(async () => {
    try {
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }]
      })
    } catch (e) {
      console.error(e)
      addToast('Failed to switch network', 'error')
    }
  }, [addToast])

  const signV1OrBasicAccountMessage = useCallback(async () => {
    if (!nonV2Account) return

    try {
      setIsInProgress(true)
      setV1OrEoaAddress(nonV2Account)
      const signature = await window.ambire.request({
        method: 'personal_sign',
        params: [`Assign to Ambire Legends ${connectedAccount}`, nonV2Account]
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
  }, [addToast, connectedAccount, nonV2Account])

  const sendV2Transaction = useCallback(async () => {
    try {
      setIsInProgress(true)
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new Contract(LEGENDS_CONTRACT_ADDRESS, LEGENDS_CONTRACT_INTERFACE, signer)

      await contract.linkAndAcceptInvite(
        connectedAccount,
        v1OrEoaAddress,
        ZeroAddress,
        v1OrBasicSignature
      )
      setAllowNonV2Connection(false)
      onComplete()
      addToast('Successfully linked accounts', 'success')
    } catch (e) {
      console.error(e)
      addToast('Failed to sign transaction', 'error')
    } finally {
      setIsInProgress(false)
    }
  }, [
    connectedAccount,
    v1OrEoaAddress,
    v1OrBasicSignature,
    setAllowNonV2Connection,
    onComplete,
    addToast
  ])

  const onButtonClick = useCallback(async () => {
    await changeNetworkToBase()

    if (activeStep === STEPS.SIGN_MESSAGE) {
      await signV1OrBasicAccountMessage()
    } else if (activeStep === STEPS.SIGN_TRANSACTION) {
      await sendV2Transaction()
    }
  }, [activeStep, changeNetworkToBase, sendV2Transaction, signV1OrBasicAccountMessage])

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
    </CardActionWrapper>
  )
}

export default LinkAcc
