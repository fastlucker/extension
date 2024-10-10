import { ethers, Interface } from 'ethers'
import React, { useCallback, useState } from 'react'
import { Wheel } from 'react-custom-roulette'

import Modal from '@legends/components/Modal'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import useAccountContext from '@legends/hooks/useAccountContext'

import styles from './WheelComponentModal.module.scss'

export const ONCHAIN_TXNS_LEGENDS_ADDRESS = '0x1415926535897932384626433832795028841971'
export const iface = new Interface(['function spinWheel(uint256)'])

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
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const WheelComponentModal: React.FC<WheelComponentProps> = ({ isOpen, setIsOpen }) => {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const { connectedAccount } = useAccountContext()

  const handleSpinClick = () => {
    if (!mustSpin) {
      broadcastTransaction()
      const newPrizeNumber = Math.floor(Math.random() * data.length)
      setPrizeNumber(newPrizeNumber)
      setMustSpin(true)
    }
  }

  const broadcastTransaction = useCallback(async () => {
    if (!connectedAccount || !window.ambire) return

    // Switch to Base chain
    await window.ambire.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID }]
    })

    const provider = new ethers.BrowserProvider(window.ambire)

    const signer = await provider.getSigner()

    console.log('signer', signer)

    const randomValue = BigInt(Math.floor(Math.random() * 1000000).toString())
    const tx = await signer.sendTransaction({
      to: ONCHAIN_TXNS_LEGENDS_ADDRESS,
      data: iface.encodeFunctionData('spinWheel', [randomValue])
    })
    console.log('transactionRes', tx)
  }, [connectedAccount])

  return (
    <Modal className={styles.modal} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Heading className={styles.heading}>Spin the wheel</Modal.Heading>
      <Modal.Text className={styles.description}>
        To start spinning the wheel, you’ll need to sign a transaction. This helps us verify and
        process your spin securely. Please confirm the transaction in your wallet, and get ready for
        your chance to win amazing rewards!
      </Modal.Text>
      <div className={styles.wheelContainer}>
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
          fontFamily='"Roboto Slab", serif'
          fontSize={35}
          perpendicularText
          pointerProps={{
            src: '/images/pointer.png',
            style: { rotate: '46deg', top: '50px', right: '10px', width: '148px' }
          }}
        />
        <button
          onClick={handleSpinClick}
          disabled={mustSpin}
          type="button"
          className={styles.button}
        >
          {mustSpin ? 'Spinning' : 'Spin'}
        </button>
      </div>
    </Modal>
  )
}

export default WheelComponentModal
