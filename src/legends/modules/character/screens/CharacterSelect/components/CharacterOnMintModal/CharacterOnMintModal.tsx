import React from 'react'

import Modal from '@legends/components/Modal'
import Stacked from '@legends/components/Stacked'

import styles from './CharacterOnMintModal.module.scss'

interface CharacterOnMintModalProps {
  isOpen: boolean
  onButtonClick: () => void
}

const CharacterOnMintModal: React.FC<CharacterOnMintModalProps> = ({ isOpen, onButtonClick }) => {
  return (
    <Modal isOpen={isOpen} isClosable={false} className={styles.modal}>
      <div>
        <p className={styles.title}>⚔️ Welcome to the Adventure! ⚔️</p>
        <p className={styles.description}>
          Remember, every transaction made with this Smart Account on Ethereum, Base, Optimism,
          Arbitrum, and Scroll earns you XP, regardless of the dApp you’re using. <br />
          Embark on your journey to becoming a Legend! 🌟
        </p>
        <div className={styles.stackedWrapper}>
          <Stacked chains={['ethereum', 'base', 'arbitrum', 'scroll', 'optimism']} />
        </div>
        <button onClick={onButtonClick} type="button" className={styles.button}>
          Continue
        </button>
      </div>
    </Modal>
  )
}

export default CharacterOnMintModal
