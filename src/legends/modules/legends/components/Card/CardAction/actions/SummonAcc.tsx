import React, { FC, useMemo, useState } from 'react'

import CopyIcon from '@common/assets/svg/CopyIcon'
import Input from '@legends/components/Input'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useToast from '@legends/hooks/useToast'
import { useInviteEOA } from '@legends/modules/legends/hooks'
import { CardFromResponse } from '@legends/modules/legends/types'

import styles from './Action.module.scss'
import CardActionWrapper from './CardActionWrapper'

type Props = {
  buttonText: string
  onComplete: () => void
  meta: CardFromResponse['meta']
}

const SummonAcc: FC<Props> = ({ buttonText, onComplete, meta }) => {
  const { addToast } = useToast()
  const {
    inviteEOA,
    switchNetwork,
    eoaAddress,
    setEoaAddress,
    isEOAAddressValid: isValid
  } = useInviteEOA()
  const { onLegendComplete } = useLegendsContext()

  const [isInProgress, setIsInProgress] = useState(false)
  const [step, setStep] = useState(0)

  const inputValidation = useMemo(() => {
    if (!eoaAddress) return null

    return {
      isValid,
      message: !isValid ? 'Invalid address' : ''
    }
  }, [eoaAddress, isValid])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `⚠️ TRADE OFFER ⚠️ \nYou download Ambire, we both win 🎉 \n1. Download the Ambire extension: https://www.ambire.com/get-extension \n2. Use my referral code so we both get XP: ${
          meta?.invitationKey || ''
        }\n3. Join Ambire Legends - on-chain quests by Ambire with XP and rewards: https://legends.ambire.com/`
      )
      addToast('Text with referral code copied to clipboard', 'success')
    } catch (e: any) {
      addToast('Failed to copy referral code', 'error')
      console.error(e)
    }
  }

  const onButtonClick = async () => {
    if (step === 1) {
      copyToClipboard()
      onComplete()
      return
    }
    try {
      await switchNetwork()
      setIsInProgress(true)
      await inviteEOA()
      addToast('Successfully invited EOA address', 'success')
      setStep(1)
      onLegendComplete()
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
      buttonText={step ? 'Copy and Close' : buttonText}
      disabled={!(step === 1) && !isValid}
      onButtonClick={onButtonClick}
    >
      {step === 0 && (
        <Input
          label="EOA Address"
          placeholder="Enter EOA Address"
          value={eoaAddress}
          validation={inputValidation}
          onChange={(e) => setEoaAddress(e.target.value)}
        />
      )}
      {step === 1 && (
        <>
          <div> 🎉 Congratulations! 🎉</div>
          The EOA address has been successfully added to your referred friends. <br /> Now is your
          turn to invite them in a way they couldn&apos;t refuse.Here is an example:
          <br />
          <div className={styles.copySectionWrapper}>
            <div className={styles.copyField}>
              <div>
                ⚠️ TRADE OFFER ⚠️ <br />
                You download Ambire, we both win 🎉 <br /> 1. Download the Ambire extension:{' '}
                <a
                  target="_blank"
                  href="https://www.ambire.com/get-extension"
                  rel="noreferrer"
                  className={styles.link}
                >
                  https://www.ambire.com/get-extension
                </a>
                <br /> 2. Use my referral code so we both get XP: {meta?.invitationKey} <br /> 3.
                Join Ambire Legends - on-chain quests by Ambire with XP and rewards:{' '}
                <a
                  target="_blank"
                  href="https://legends.ambire.com/"
                  rel="noreferrer"
                  className={styles.link}
                >
                  https://legends.ambire.com/{' '}
                </a>
              </div>
              <CopyIcon className={styles.copyIcon} onClick={copyToClipboard} />
            </div>
          </div>
        </>
      )}
    </CardActionWrapper>
  )
}

export default SummonAcc
