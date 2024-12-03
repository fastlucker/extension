import { ethers, hexlify, Interface, randomBytes } from 'ethers'
import React, { useCallback, useState } from 'react'
import { Wheel } from 'react-custom-roulette'

import { Legends as LEGENDS_CONTRACT_ABI } from '@ambire-common/libs/humanizer/const/abis/Legends'
import ConfettiAnimation from '@common/modules/dashboard/components/ConfettiAnimation'
import { RELAYER_URL } from '@env'
import Modal from '@legends/components/Modal'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import { ActivityTransaction, LegendActivity } from '@legends/contexts/recentActivityContext/types'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useToast from '@legends/hooks/useToast'

import styles from './WheelComponentModal.module.scss'
import wheelData from './wheelData'

export const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

interface WheelComponentProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

let fetchTryCount = 0
const WheelComponentModal: React.FC<WheelComponentProps> = ({ isOpen, setIsOpen }) => {
  const [prizeNumber, setPrizeNumber] = useState<null | number>(null)
  const [wheelState, setWheelState] = useState<
    'initial' | 'signing' | 'waiting-txn' | 'calculating-reward' | 'spinning' | 'spun'
  >('initial')
  const { connectedAccount } = useAccountContext()
  const { onLegendComplete } = useLegendsContext()
  const { addToast } = useToast()
  const { sendCalls, getCallsStatus } = useErc5792()

  const checkTransactionStatus = useCallback(async () => {
    if (wheelState === 'spinning' || wheelState === 'spun') return true
    try {
      fetchTryCount += 1
      const response = await fetch(`${RELAYER_URL}/legends/activity/${connectedAccount}`)

      if (!response.ok) throw new Error('Failed to fetch transaction status')

      const data = await response.json()
      const today = new Date().toISOString().split('T')[0]

      const transaction: ActivityTransaction | undefined = data.transactions.find(
        (txn: ActivityTransaction) =>
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
        setWheelState('spinning')
        return true
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error)
      return false
    }

    return false
  }, [wheelState, connectedAccount])

  const broadcastTransaction = useCallback(async () => {
    // Switch to Base chain
    await window.ambire.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID }]
    })

    const provider = new ethers.BrowserProvider(window.ambire)
    const signer = await provider.getSigner()

    try {
      setWheelState('signing')
      const randomValueBytes = randomBytes(32)
      const randomValue = BigInt(hexlify(randomValueBytes))

      const chainIdHex = ethers.toBeHex(BASE_CHAIN_ID)
      const callsId = await sendCalls(chainIdHex, await signer.getAddress(), [
        {
          to: LEGENDS_CONTRACT_ADDRESS,
          data: LEGENDS_CONTRACT_INTERFACE.encodeFunctionData('spinWheel', [randomValue])
        }
      ])

      setWheelState('waiting-txn')
      const receipt = await getCallsStatus(callsId)

      if (receipt && receipt.status === '0x1') {
        setWheelState('calculating-reward')
        const transactionFound = await checkTransactionStatus()
        if (!transactionFound) {
          const intervalId = setInterval(async () => {
            if (fetchTryCount >= 10) {
              clearInterval(intervalId)
              console.error('Failed to fetch transaction status after 10 attempts')
              addToast(
                "We are unable to retrieve your prize at the moment. No worries, it will be displayed in your account's activity shortly.",
                'error'
              )
              setWheelState('spun')
              await onLegendComplete()
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
      setWheelState('initial')
    }
  }, [checkTransactionStatus, addToast, onLegendComplete, sendCalls, getCallsStatus])

  const handleSpinClick = async () => {
    if (wheelState === 'initial') {
      await broadcastTransaction()
    }
  }

  const getButtonLabel = (): string => {
    switch (wheelState) {
      case 'signing':
        return 'Signing...'
      case 'waiting-txn':
        return 'Waiting for transaction...'
      case 'calculating-reward':
        return 'Calculating reward...'
      case 'spinning':
        return 'Spinning...'
      case 'spun':
        if (!prizeNumber) return 'We are unable to retrieve your prize at the moment'
        return `You won ${wheelData[prizeNumber].option} xp`
      default:
        return 'Spin the Wheel'
    }
  }

  return (
    <Modal className={styles.modal} isOpen={isOpen} setIsOpen={setIsOpen}>
      {wheelState === 'spun' ? (
        <ConfettiAnimation width={650} height={500} autoPlay loop className={styles.confetti} />
      ) : null}
      <Modal.Heading className={styles.heading}>Spin the wheel</Modal.Heading>
      <Modal.Text className={styles.description}>
        To start spinning the wheel, you’ll need to sign a transaction. This helps us verify and
        process your spin securely. Please confirm the transaction in your wallet, and get ready for
        your chance to win amazing rewards!
      </Modal.Text>
      <div className={styles.wheelContainer}>
        <Wheel
          // TODO: Figure out why the wheel starts spinning a couple of times
          // before the actual spin. The most likely cause is component rerendering.
          mustStartSpinning={wheelState === 'spinning'}
          prizeNumber={prizeNumber ?? 6}
          onStopSpinning={async () => {
            setWheelState('spun')
            if (!prizeNumber) {
              addToast(
                "We are unable to retrieve your prize at the moment. No worries, it will be displayed in your account's activity shortly.",
                'error'
              )
              return
            }
            addToast(`You received ${wheelData[prizeNumber].option} xp`, 'success')
            await onLegendComplete()
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
          disabled={wheelState !== 'initial'}
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
