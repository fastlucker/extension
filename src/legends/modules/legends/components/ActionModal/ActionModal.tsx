import React, { FC } from 'react'

import Modal from '@legends/components/Modal'
import CardActionComponent from '@legends/modules/legends/components/Card/CardAction'
import { CardActionComponentProps } from '@legends/modules/legends/components/Card/CardAction/CardAction'
import HowTo from '@legends/modules/legends/components/Card/HowTo'
import { HowToProps } from '@legends/modules/legends/components/Card/HowTo/HowTo'
import Rewards from '@legends/modules/legends/components/Card/Rewards'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardAction, CardXp } from '@legends/modules/legends/types'

import styles from './ActionModal.module.scss'

type ActionModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  onLegendCompleteWrapped: (txnId: string) => Promise<void>
  closeActionModal: () => void
  action: CardAction | null
  flavor?: string
  xp: CardXp[] | undefined
  contentImage?: string
  contentSteps?: string[]
  contentVideo?: string
  predefinedId?: string
  buttonText: string
} & Partial<HowToProps> &
  Partial<CardActionComponentProps>

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
      {!!action && (
        <CardActionComponent
          onComplete={onLegendCompleteWrapped}
          handleClose={closeActionModal}
          buttonText={buttonText}
          action={action}
        />
      )}
    </Modal>
  )
}

export default ActionModal
