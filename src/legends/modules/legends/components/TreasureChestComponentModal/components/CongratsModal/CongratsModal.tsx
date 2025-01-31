import React, { useEffect } from 'react'

import { preloadImages } from '@common/utils/images'
import CoinIcon from '@legends/common/assets/svg/CoinIcon'
import Modal from '@legends/components/Modal'

import chestImageOpened from '../../assets/chest-opened.png'
import starImage from '../../assets/star.png'
import styles from './CongratsModal.module.scss'

interface CongratsModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  treasureLegend: {
    meta: {
      points: number[]
      streak: number
    }
  }
  onButtonClick: () => Promise<void>
}

const CongratsModal: React.FC<CongratsModalProps> = ({
  isOpen,
  setIsOpen,
  treasureLegend,
  onButtonClick
}) => {
  // Load the modal in the dom but don't show it immediately
  // This is done to preload all images
  useEffect(() => {
    preloadImages([chestImageOpened, starImage])
  }, [])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className={styles.modal}>
      <div className={styles.congratsModal}>
        <Modal.Heading className={styles.title}>Congrats!</Modal.Heading>
        <Modal.Text className={styles.text}>
          You Collected +{treasureLegend.meta.points[treasureLegend.meta.streak - 1] || 0} XP today!
        </Modal.Text>
        <div className={styles.openedChestWrapper}>
          <div className={styles.prize}>
            +{treasureLegend.meta.points[treasureLegend.meta.streak - 1] || 0}
            <CoinIcon width={32} height={32} />{' '}
          </div>
          <img src={starImage} alt="star" className={styles.star} />
          <img src={chestImageOpened} alt="chest-opened" className={styles.chestOpenedImage} />
        </div>
        <button type="button" className={styles.button} onClick={onButtonClick}>
          Thanks, go back
        </button>
      </div>
    </Modal>
  )
}

export default CongratsModal
