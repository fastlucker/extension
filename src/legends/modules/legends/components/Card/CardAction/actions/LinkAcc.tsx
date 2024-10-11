import { BrowserProvider, Contract, Interface } from 'ethers'
import React, { FC, useMemo, useState } from 'react'

import Alert from '@legends/components/Alert'
import { LEGENDS_CONTRACT_ABI } from '@legends/constants/abis/summon'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import useAccountContext from '@legends/hooks/useAccountContext'
import useToast from '@legends/hooks/useToast'

import Stepper from '../../../Stepper/Stepper'
import styles from './Action.module.scss'
import CardActionWrapper from './CardActionWrapper'

type Props = {
  onComplete: () => void
}

const BUTTON_TEXT = {
  0: 'Connect a v1/Basic Account',
  1: 'Sign message',
  2: 'Connect your v2 account again',
  3: 'Sign transaction'
}

const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

const LinkAcc: FC<Props> = ({ onComplete }) => {
  const { isConnectedAccountV2, connectedAccount, lastConnectedV2Account } = useAccountContext()
  const { addToast } = useToast()
  const [isInProgress, setIsInProgress] = useState(false)
  const [v1OrBasicSignature, setV1OrBasicSignature] = useState('')
  const [messageSignedForV2Account, setMessageSignedForV2Account] = useState('')

  const activeStep = useMemo(() => {
    if (v1OrBasicSignature && isConnectedAccountV2) return 3
    if (v1OrBasicSignature) return 2
    if (!isConnectedAccountV2 && !v1OrBasicSignature) return 1

    return 0
  }, [isConnectedAccountV2, v1OrBasicSignature])

  const isActionEnabled = useMemo(() => {
    if (activeStep === 1) {
      return !isConnectedAccountV2
    }
    if (activeStep === 3) {
      return isConnectedAccountV2 && messageSignedForV2Account === connectedAccount
    }

    return false
  }, [activeStep, isConnectedAccountV2, messageSignedForV2Account, connectedAccount])

  const onButtonClick = async () => {
    if (!lastConnectedV2Account) return

    if (activeStep === 1) {
      try {
        setIsInProgress(true)
        const signature = await window.ambire.request({
          method: 'personal_sign',
          params: [`Assign to Ambire Legends ${lastConnectedV2Account}`, connectedAccount]
        })
        setMessageSignedForV2Account(lastConnectedV2Account)

        if (typeof signature !== 'string') throw new Error('Invalid signature')

        setV1OrBasicSignature(signature)
      } catch (e) {
        console.error(e)
        addToast('Failed to sign message', 'error')
      } finally {
        setIsInProgress(false)
      }
    } else if (activeStep === 3) {
      try {
        setIsInProgress(true)
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const contract = new Contract(LEGENDS_CONTRACT_ADDRESS, LEGENDS_CONTRACT_INTERFACE, signer)

        await contract.linkAndAcceptInvite(
          lastConnectedV2Account,
          connectedAccount,
          lastConnectedV2Account,
          v1OrBasicSignature
        )
        onComplete()
        addToast('Successfully linked accounts', 'success')
      } catch (e) {
        console.error(e)
        addToast('Failed to sign transaction', 'error')
      } finally {
        setIsInProgress(false)
      }
    }
  }

  return (
    <CardActionWrapper
      isLoading={isInProgress}
      loadingText="Signing..."
      disabled={!isActionEnabled}
      buttonText={BUTTON_TEXT[activeStep]}
      onButtonClick={onButtonClick}
    >
      <Stepper
        activeStep={activeStep}
        steps={[
          'Connect a v1/basic account',
          'Sign a message',
          'Connect your v2 account again',
          'Sign a transaction'
        ]}
        className={styles.stepper}
      />
      {activeStep === 3 && !isActionEnabled && (
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
