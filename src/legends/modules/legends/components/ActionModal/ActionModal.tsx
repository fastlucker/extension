import React, { FC } from 'react'

import Modal from '@legends/components/Modal'
import CardActionComponent from '@legends/modules/legends/components/Card/CardAction'
import HowTo from '@legends/modules/legends/components/Card/HowTo'
import Rewards from '@legends/modules/legends/components/Card/Rewards'
import { CardAction, CardXp } from '@legends/modules/legends/types'

import { CARD_PREDEFINED_ID } from '../../constants'
import styles from './ActionModal.module.scss'

type ActionModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  flavor?: string
  xp?: CardXp[]
  contentImage?: string
  buttonText: string
  onLegendCompleteWrapped: (txnId: string) => Promise<void>
  closeActionModal: () => void
  copyToClipboard: () => void
  contentSteps?: string[]
  contentVideo?: string
  action: CardAction
  meta?: any
  predefinedId: string
}

const ActionModal: FC<ActionModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  flavor,
  xp,
  contentImage,
  buttonText,
  onLegendCompleteWrapped,
  closeActionModal,
  copyToClipboard,
  contentSteps,
  contentVideo,
  action,
  meta,
  predefinedId
}) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className={styles.modal}>
      <Modal.Heading className={styles.modalHeading}>
        <div className={styles.modalHeadingTitle}>{title}</div>
        {xp && <Rewards xp={xp} size="lg" />}
      </Modal.Heading>
      <Modal.Text className={styles.modalText}>{flavor}</Modal.Text>
      {contentSteps && (
        <HowTo
          steps={contentSteps}
          image={contentImage}
          imageAlt={flavor}
          video={contentVideo}
          meta={predefinedId === CARD_PREDEFINED_ID.Referral ? meta : undefined}
          copyToClipboard={
            predefinedId === CARD_PREDEFINED_ID.Referral ? copyToClipboard : undefined
          }
        />
      )}
      <CardActionComponent
        onComplete={onLegendCompleteWrapped}
        handleClose={closeActionModal}
        buttonText={buttonText}
        action={action}
      />
    </Modal>
  )
}

export default ActionModal
