import React, { useState } from 'react'
import { Wheel } from 'react-custom-roulette'

import ConfettiAnimation from '@common/modules/dashboard/components/ConfettiAnimation'
import Modal from '@legends/components/Modal'

import styles from './WheelComponent.module.scss'

const data = [
  { option: '50', style: { backgroundColor: '#EADDC9', textColor: '#333131' } },
  { option: '10', style: { backgroundColor: '#F2E9DB', textColor: '#333131' } },
  { option: '5', style: { backgroundColor: '#EADDC9', textColor: '#333131' } },
  { option: '10', style: { backgroundColor: '#EADDC9', textColor: '#333131' } },
  { option: '20', style: { backgroundColor: '#F2E9DB', textColor: '#333131' } },
  { option: '50', style: { backgroundColor: '#F2E9DB', textColor: '#333131' } },
  { option: '100', style: { backgroundColor: '#F8E3B7', textColor: '#B67D02' } },
  { option: '50', style: { backgroundColor: '#F2E9DB', textColor: '#333131' } },
  { option: '10', style: { backgroundColor: '#EADDC9', textColor: '#333131' } },
  { option: '5', style: { backgroundColor: '#F2E9DB', textColor: '#333131' } },
  { option: '10', style: { backgroundColor: '#EADDC9', textColor: '#333131' } },
  { option: '20', style: { backgroundColor: '#F2E9DB', textColor: '#333131' } }
]

interface WheelComponentProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const WheelComponent: React.FC<WheelComponentProps> = ({ isOpen, setIsOpen }) => {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length)
      setPrizeNumber(newPrizeNumber)
      setMustSpin(true)
    }
  }

  return (
    <Modal className={styles.modal} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Heading className={styles.heading}>Spin the wheel</Modal.Heading>
      <Modal.Text className={styles.text}>
        To start spinning the wheel, you’ll need to sign a transaction. This helps us verify and
        process your spin securely. Please confirm the transaction in your wallet, and get ready for
        your chance to win amazing rewards!
      </Modal.Text>
      {data[prizeNumber].option === '100' && !mustSpin && (
        <ConfettiAnimation width={500} height={500} autoPlay />
      )}
      <div className={styles.rouletteContainer}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false)
          }}
          radiusLineColor="#BAAFAC"
          radiusLineWidth={1}
          outerBorderColor="#E7AA27"
          outerBorderWidth={16}
          perpendicularText
          fontFamily='"Roboto Slab", sans-serif'
          pointerProps={{
            src: '/images/pointer.png',
            style: { rotate: '50deg', top: '50px', right: '20px', width: '90px' }
          }}
        />
        <button onClick={handleSpinClick} type="button" className={styles.button}>
          Spin
        </button>
      </div>
    </Modal>
  )
}

export default WheelComponent
