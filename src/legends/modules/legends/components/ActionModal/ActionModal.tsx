import React, { FC } from 'react'

import Modal from '@legends/components/Modal'
import CardActionComponent from '@legends/modules/legends/components/Card/CardAction'
import { CardActionComponentProps } from '@legends/modules/legends/components/Card/CardAction/CardAction'
import Rewards from '@legends/modules/legends/components/Card/CardContent/Rewards'
import HowTo from '@legends/modules/legends/components/Card/HowTo'
import { HowToProps } from '@legends/modules/legends/components/Card/HowTo/HowTo'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardFromResponse } from '@legends/modules/legends/types'

import WheelComponentModal from '../WheelComponentModal'
import styles from './ActionModal.module.scss'
import Referral from './Referral/Referral'

type ActionModalProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onLegendCompleteWrapped: (txnId: string) => Promise<void>
  closeActionModal: () => void
  predefinedId?: string
  buttonText: string
} & Partial<HowToProps> &
  Partial<CardActionComponentProps> &
  Pick<
    CardFromResponse,
    'meta' | 'xp' | 'contentImage' | 'contentSteps' | 'contentVideo' | 'title' | 'flavor' | 'action'
  >

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
  contentSteps,
  contentVideo,
  meta,
  action,
  predefinedId
}) => {
  if (predefinedId === CARD_PREDEFINED_ID.wheelOfFortune) {
    return <WheelComponentModal isOpen={isOpen} setIsOpen={setIsOpen} />
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className={styles.modal}>
      <Modal.Heading className={styles.modalHeading}>
        <div className={styles.modalHeadingTitle}>{title}</div>
        {xp && <Rewards xp={xp} size="lg" />}
      </Modal.Heading>
      <Modal.Text className={styles.modalText}>{flavor}</Modal.Text>
      {contentSteps && (
        <HowTo steps={contentSteps} image={contentImage} imageAlt={flavor} video={contentVideo}>
          {predefinedId === CARD_PREDEFINED_ID.Referral && <Referral meta={meta} />}
        </HowTo>
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
