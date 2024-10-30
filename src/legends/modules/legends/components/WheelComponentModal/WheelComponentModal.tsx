import { ethers, hexlify, Interface, randomBytes } from 'ethers'
import React, { useCallback, useState } from 'react'
import { Wheel } from 'react-custom-roulette'

import { Legends as LEGENDS_CONTRACT_ABI } from '@ambire-common/libs/humanizer/const/abis/Legends'
import ConfettiAnimation from '@common/modules/dashboard/components/ConfettiAnimation'
import { RELAYER_URL } from '@env'
import Modal from '@legends/components/Modal'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import { Activity, LegendActivity } from '@legends/contexts/activityContext/types'
import useAccountContext from '@legends/hooks/useAccountContext'
import useActivityContext from '@legends/hooks/useActivityContext'
import useToast from '@legends/hooks/useToast'
import { useLegends } from '@legends/modules/legends/hooks'

import styles from './WheelComponentModal.module.scss'
import wheelData from './wheelData'

export const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

interface WheelComponentProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

let fetchTryCount = 0
const WheelComponentModal: React.FC<WheelComponentProps> = ({ isOpen, setIsOpen }) => {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(6)
  const [spinOfTheDay, setSpinOfTheDay] = useState(0)
  const [isInProgress, setIsInProgress] = useState(false)
  const { getActivity } = useActivityContext()
  const { connectedAccount, isConnectedAccountV2 } = useAccountContext()
  const { addToast } = useToast()
  const { getLegends } = useLegends()

  const checkTransactionStatus = useCallback(async () => {
    if (spinOfTheDay === 1) return true
    try {
      fetchTryCount += 1
      const response = await fetch(`${RELAYER_URL}/legends/activity/${connectedAccount}`)
      const txns = await response.json()
      const today = new Date().toISOString().split('T')[0]

      const transaction: Activity | undefined = txns.find(
        (txn: Activity) =>
          txn.submittedAt.startsWith(today) &&
          txn.legends.activities &&
          txn.legends.activities.some((activity: LegendActivity) =>
            activity.action.startsWith('WheelOfFortune')
          )
      )

      if (!transaction) return false
      const spinWheelActivity = transaction.legends.activities.find((activity: any) => {
        return activity.action.includes('WheelOfFortune')
      })

      if (!spinWheelActivity) return false
      const spinWheelActivityIndex = wheelData.findIndex(
        (item: any) => item.option === spinWheelActivity.xp.toString()
      )

      if (spinWheelActivityIndex !== -1) {
        setPrizeNumber(spinWheelActivityIndex)
        setMustSpin(true)
        setSpinOfTheDay(1)
        getActivity()
        getLegends()
        return true
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error)
      addToast('Error fetching transaction status', 'error')
      return false
    }

    return false
  }, [connectedAccount, spinOfTheDay, addToast, getActivity, getLegends])

  const broadcastTransaction = useCallback(async () => {
    if (!connectedAccount || !isConnectedAccountV2 || !window.ambire) return

    // Switch to Base chain
    await window.ambire.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID }]
    })

    const provider = new ethers.BrowserProvider(window.ambire)
    const signer = await provider.getSigner()

    try {
      setIsInProgress(true)
      const randomValueBytes = randomBytes(32)
      const randomValue = BigInt(hexlify(randomValueBytes))

      const tx = await signer.sendTransaction({
        to: LEGENDS_CONTRACT_ADDRESS,
        data: LEGENDS_CONTRACT_INTERFACE.encodeFunctionData('spinWheel', [randomValue])
      })

      const receipt = await tx.wait()

      if (receipt && receipt.status === 1) {
        const transactionFound = await checkTransactionStatus()
        if (!transactionFound) {
          const intervalId = setInterval(async () => {
            if (fetchTryCount >= 10) {
              clearInterval(intervalId)
              console.error('Failed to fetch transaction status after 10 attempts')
              addToast('Failed to fetch transaction status', 'error')
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
      addToast('Failed to broadcast transaction', 'error')
      setMustSpin(false)
    } finally {
      setIsInProgress(false)
    }
  }, [connectedAccount, checkTransactionStatus, addToast, isConnectedAccountV2])

  const handleSpinClick = async () => {
    if (!mustSpin) {
      await broadcastTransaction()
    }
  }

  const getButtonLabel = (): string => {
    if (isInProgress) return 'Signing...'
    if (mustSpin) return 'Spinning...'
    if (spinOfTheDay) return 'Already Spun'
    return 'Spin the Wheel'
  }

  return (
    <Modal className={styles.modal} isOpen={isOpen} setIsOpen={setIsOpen}>
      {!mustSpin && spinOfTheDay ? (
        <ConfettiAnimation width={800} height={600} autoPlay className={styles.confetti} />
      ) : null}
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
          onStopSpinning={() => {
            setMustSpin(false)
            addToast(`You received ${wheelData[prizeNumber].option} xp`, 'success')
          }}
          data={wheelData}
          radiusLineColor="#BAAFAC"
          radiusLineWidth={1}
          outerBorderColor="#E7AA27"
          outerBorderWidth={16}
          fontFamily="Sentient"
          fontSize={25}
          perpendicularText
          pointerProps={{
            src: '/images/pointer.png',
            style: { rotate: '46deg', top: '35px', right: '0', width: '148px' }
          }}
        />
        <button
          onClick={handleSpinClick}
          disabled={mustSpin || !!spinOfTheDay || !!isInProgress}
          type="button"
          className={styles.button}
        >
          {getButtonLabel()}
        </button>
      </div>
    </Modal>
  )
}

export default WheelComponentModal
