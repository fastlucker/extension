import React, { FC } from 'react'
import Modal from '@legends/components/Modal'
import styles from './NonV2Modal.module.scss'

const NonV2Modal: FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <Modal isOpen={isOpen} isClosable={false} className={styles.modal}>
    <Modal.Heading>Please connect to an Ambire v2 account</Modal.Heading>
    <Modal.Text className={styles.text}>
      To use Legends, please connect an Ambire v2 account.
      <br />
      EOAs and Ambire v1 accounts are not permitted.
    </Modal.Text>
  </Modal>
)

export default NonV2Modal
