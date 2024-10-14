import { ethers, Interface } from 'ethers'
import React, { useCallback, useState } from 'react'
import { Wheel } from 'react-custom-roulette'

import Modal from '@legends/components/Modal'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import useAccountContext from '@legends/hooks/useAccountContext'

import styles from './WheelComponentModal.module.scss'

const relayerUrl = 'https://staging-relayer.ambire.com'

export const ONCHAIN_TXNS_LEGENDS_ADDRESS = '0x1415926535897932384626433832795028841971'
export const iface = new Interface(['function spinWheel(uint256)'])

const data = [
  { option: '80', style: { backgroundColor: '#EADDC9', textColor: '#333131' }, optionSize: 3 },
  { option: '50', style: { backgroundColor: '#F2E9DB', textColor: '#333131' }, optionSize: 3 },
  { option: '20', style: { backgroundColor: '#EADDC9', textColor: '#333131' }, optionSize: 3 },
  { option: '300', style: { backgroundColor: '#F2E9DB', textColor: '#333131' }, optionSize: 2 },
  { option: '50', style: { backgroundColor: '#EADDC9', textColor: '#333131' }, optionSize: 3 },
  { option: '80', style: { backgroundColor: '#F2E9DB', textColor: '#333131' }, optionSize: 3 },
  { option: '150', style: { backgroundColor: '#F8E3B7', textColor: '#B67D02' }, optionSize: 3 },
  { option: '80', style: { backgroundColor: '#F2E9DB', textColor: '#333131' }, optionSize: 3 },
  { option: '50', style: { backgroundColor: '#EADDC9', textColor: '#333131' }, optionSize: 3 },
  { option: '20', style: { backgroundColor: '#F2E9DB', textColor: '#333131' }, optionSize: 3 },
  { option: '50', style: { backgroundColor: '#EADDC9', textColor: '#333131' }, optionSize: 3 }
]
interface WheelComponentProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const WheelComponentModal: React.FC<WheelComponentProps> = ({ isOpen, setIsOpen }) => {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(6)
  const [spinOfTheDay, setSpinOfTheDay] = useState(0)
  const { connectedAccount } = useAccountContext()

  const handleSpinClick = () => {
    if (!mustSpin) {
      broadcastTransaction()
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

    let fetchTryCount = 0

    const checkTransactionStatus = async (): Promise<boolean> => {
      if (spinOfTheDay === 1) return true
      try {
        fetchTryCount += 1
        const response = await fetch(`${relayerUrl}/legends/activity/${connectedAccount}`)
        const txns = await response.json()
        const today = new Date().toISOString().split('T')[0]

        const transaction = txns.find(
          (txn) =>
            txn.submittedAt.startsWith(today) &&
            txn.legends.activities &&
            txn.legends.activities.find((activity: any) =>
              activity.action.substring('WheelOfFortune')
            )
        )

        if (!transaction) return false
        const spinWheelActivity = transaction.legends.activities.find((activity: any) => {
          return activity.action.includes('WheelOfFortune')
        })

        const spinWheelActivityIndex = data.findIndex(
          (item: any) => item.option === spinWheelActivity.xp.toString()
        )

        if (spinWheelActivityIndex !== -1) {
          setPrizeNumber(spinWheelActivityIndex)
          setMustSpin(true)
          setSpinOfTheDay(1)
          return true
        }
      } catch (error) {
        console.error('Error fetching transaction status:', error)
        alert('Error fetching transaction status')
        return false
      }
    }

    try {
      const randomValue = BigInt(Math.floor(Math.random() * 1000000).toString())
      const tx = await signer.sendTransaction({
        to: ONCHAIN_TXNS_LEGENDS_ADDRESS,
        data: iface.encodeFunctionData('spinWheel', [randomValue])
      })

      const receipt = await tx.wait()

      if (receipt.status === 1) {
        const transactionFound = await checkTransactionStatus()
        if (!transactionFound) {
          const intervalId = setInterval(async () => {
            if (fetchTryCount >= 10) {
              clearInterval(intervalId)
              console.error('Failed to fetch transaction status after 10 attempts')
              return
            }
            const found = await checkTransactionStatus()
            if (found) {
              clearInterval(intervalId)
            }
          }, 3000)
        }
      }
    } catch (e) {
      console.error('Failed to broadcast transaction:', e)
      setMustSpin(false)
    }
  }, [connectedAccount, spinOfTheDay])

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
          onStopSpinning={() => setMustSpin(false)}
          data={data}
          radiusLineColor="#BAAFAC"
          radiusLineWidth={1}
          outerBorderColor="#E7AA27"
          outerBorderWidth={16}
          fontFamily="Sentient"
          fontSize={25}
          perpendicularText
          pointerProps={{
            src: '/images/pointer.png',
            style: { rotate: '46deg', top: '30px', right: '0', width: '148px' }
          }}
        />
        <button
          onClick={handleSpinClick}
          disabled={mustSpin || !!spinOfTheDay}
          type="button"
          className={styles.button}
        >
          {mustSpin ? 'Spinning' : 'Send Transaction & Spin'}
        </button>
      </div>
    </Modal>
  )
}

export default WheelComponentModal
