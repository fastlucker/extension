import React, { useState } from 'react'

import Modal from '@legends/components/Modal'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useRecentActivityContext from '@legends/hooks/useRecentActivityContext'
import useToast from '@legends/hooks/useToast'
import styles from '@legends/modules/legends/components/Card/Card.module.scss'
import CardActionComponent from '@legends/modules/legends/components/Card/CardAction'
import HowTo from '@legends/modules/legends/components/Card/HowTo'
import Rewards from '@legends/modules/legends/components/Card/Rewards'
import { CardActionType } from '@legends/modules/legends/types'

import { CARD_PREDEFINED_ID, PREDEFINED_ACTION_LABEL_MAP } from '../../constants'

interface LeaderModalProps {
  setIsActionModalOpen: (isOpen: boolean) => void
  isActionModalOpen: boolean
}

const LeaderModal: React.FC<LeaderModalProps> = ({ setIsActionModalOpen, isActionModalOpen }) => {
  const { getActivity } = useRecentActivityContext()
  const { addToast } = useToast()

  const { legends, isLoading, onLegendComplete } = useLegendsContext()

  const card = !isLoading && legends.find((legend) => legend?.action?.predefinedId === 'referral')

  const { xp, title, flavor, contentSteps, contentImage, contentVideo, action, meta } = card || {}
  const predefinedId =
    action && action?.type === CardActionType.predefined ? action.predefinedId : ''
  const buttonText = PREDEFINED_ACTION_LABEL_MAP[predefinedId] || 'Proceed'
  const [isOnLegendCompleteModalOpen, setIsOnLegendCompleteModalOpen] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `🤑Join the biggest airdrop a WALLET has ever done! 🚀 \n \nAmbire Wallet is giving away 195M $WALLET tokens through the Ambire Legends campaign. All activity with a Smart Account on 5 of the hottest EVM chains is rewarded. Start strong with the first 4 transactions free! \n \nHere’s what you need to do: \n1. Download the Ambire extension: https://www.ambire.com/get-extension \n2. Use my referral code so we both get XP: ${
          meta?.invitationKey || ''
        }\n3. Create a Smart Account in the extension and join Ambire Legends at https://legends.ambire.com/`
      )
      addToast('Text with referral code copied to clipboard', { type: 'success' })
    } catch (e: any) {
      addToast('Failed to copy referral code', { type: 'error' })
    }
  }
  const pollActivityUntilComplete = async (txnId: string, attempt: number) => {
    if (attempt > 10) {
      addToast(ERROR_MESSAGES.transactionProcessingFailed, { type: 'error' })
      return
    }

    const newActivity = await getActivity()

    const foundTxn = newActivity?.transactions?.find((txn) => txn.txId === txnId)

    if (!foundTxn) {
      if (attempt === 0) {
        addToast('We are processing your transaction. Expect your reward shortly.')
      }

      setTimeout(() => pollActivityUntilComplete(txnId, attempt + 1), 1000)
      return
    }

    const latestXpReward = foundTxn.legends.totalXp

    if (latestXpReward) {
      addToast(`Transaction completed! Reward ${latestXpReward} XP`, { type: 'success' })
    } else {
      addToast('Transaction completed!', { type: 'success' })
    }

    await onLegendComplete()
  }

  const onLegendCompleteWrapped = async (txnId: string) => {
    await pollActivityUntilComplete(txnId, 0)

    if (
      action?.type === CardActionType.predefined &&
      action.predefinedId === CARD_PREDEFINED_ID.addEOA
    ) {
      setIsOnLegendCompleteModalOpen(true)
    }
  }

  const closeActionModal = () => setIsActionModalOpen(false)

  return (
    <Modal isOpen={isActionModalOpen} setIsOpen={setIsActionModalOpen} className={styles.modal}>
      <Modal.Heading className={styles.modalHeading}>
        <div className={styles.modalHeadingTitle}>{title}</div>
        {xp && <Rewards xp={xp} size="lg" />}
      </Modal.Heading>
      <Modal.Text className={styles.modalText}>{flavor}</Modal.Text>
      {contentSteps &&
        action?.predefinedId !== CARD_PREDEFINED_ID.LinkAccount &&
        action?.predefinedId !== CARD_PREDEFINED_ID.Referral && (
          <HowTo steps={contentSteps} image={contentImage} imageAlt={flavor} video={contentVideo} />
        )}
      {contentSteps && action?.predefinedId === CARD_PREDEFINED_ID.Referral && meta && (
        <HowTo
          steps={contentSteps}
          image={contentImage}
          imageAlt={flavor}
          meta={meta}
          copyToClipboard={copyToClipboard}
        />
      )}
      <CardActionComponent
        onComplete={onLegendCompleteWrapped}
        handleClose={closeActionModal}
        buttonText={buttonText}
        action={action!}
      />
    </Modal>
  )
}

export default LeaderModal
