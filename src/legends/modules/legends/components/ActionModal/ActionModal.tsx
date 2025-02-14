import React, { createContext, FC, useContext, useMemo, useState } from 'react'

import Modal from '@legends/components/Modal'
import CardActionComponent from '@legends/modules/legends/components/Card/CardAction'
import { CardActionComponentProps } from '@legends/modules/legends/components/Card/CardAction/CardAction'
import Rewards from '@legends/modules/legends/components/Card/CardContent/Rewards'
import HowTo from '@legends/modules/legends/components/Card/HowTo'
import { HowToProps } from '@legends/modules/legends/components/Card/HowTo/HowTo'
import TreasureChestComponentModal from '@legends/modules/legends/components/TreasureChestComponentModal'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardFromResponse } from '@legends/modules/legends/types'

import WheelComponentModal from '../WheelComponentModal'
import styles from './ActionModal.module.scss'
import Referral from './Referral/Referral'

type CardActionContextType = {
  onComplete: (txnId: string) => Promise<void>
  handleClose: () => void
  activeStep: null | number
  setActiveStep: React.Dispatch<React.SetStateAction<null | number>>
}

const cardActionContext = createContext<CardActionContextType>({} as CardActionContextType)

export const useCardActionContext = () => {
  const context = useContext(cardActionContext)
  if (context === undefined) {
    throw new Error('useCardActionContext must be used within a CardActionContextProvider')
  }
  return context
}

type ActionModalProps = {
  isOpen: boolean
  onLegendCompleteWrapped: (txnId: string) => Promise<void>
  closeActionModal: () => void
  predefinedId?: string
  buttonText: string
} & Partial<HowToProps> &
  Partial<CardActionComponentProps> &
  Pick<
    CardFromResponse,
    | 'meta'
    | 'xp'
    | 'contentImage'
    | 'contentSteps'
    | 'contentVideo'
    | 'description'
    | 'flavor'
    | 'action'
  >

const ActionModal: FC<ActionModalProps> = ({
  isOpen,
  description,
  flavor,
  xp,
  contentImage,
  buttonText,
  onLegendCompleteWrapped,
  closeActionModal,
  contentSteps,
  contentVideo,
  meta,
  action,
  predefinedId
}) => {
  const [activeStep, setActiveStep] = useState<null | number>(null)

  const cardActionContextValue = useMemo(
    () => ({
      onComplete: onLegendCompleteWrapped,
      handleClose: closeActionModal,
      activeStep,
      setActiveStep
    }),
    [activeStep, closeActionModal, onLegendCompleteWrapped]
  )

  if (predefinedId === CARD_PREDEFINED_ID.wheelOfFortune) {
    return <WheelComponentModal isOpen={isOpen} handleClose={closeActionModal} />
  }

  if (predefinedId === CARD_PREDEFINED_ID.chest) {
    return <TreasureChestComponentModal isOpen={isOpen} handleClose={closeActionModal} />
  }

  return (
    <Modal isOpen={isOpen} handleClose={closeActionModal} className={styles.modal}>
      <Modal.Heading className={styles.modalHeading}>
        <div className={styles.modalHeadingTitle}>{description}</div>
        {xp && <Rewards xp={xp} size="lg" />}
      </Modal.Heading>
      <Modal.Text className={styles.modalText}>{flavor}</Modal.Text>
      {contentSteps && (
        <HowTo
          steps={contentSteps}
          activeStep={activeStep}
          image={contentImage}
          imageAlt={flavor}
          video={contentVideo}
        >
          {predefinedId === CARD_PREDEFINED_ID.referral && <Referral meta={meta} />}
        </HowTo>
      )}
      {!!action && (
        <cardActionContext.Provider value={cardActionContextValue}>
          <CardActionComponent buttonText={buttonText} action={action} />
        </cardActionContext.Provider>
      )}
    </Modal>
  )
}

export default ActionModal
