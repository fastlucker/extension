import { ethers, hexlify, Interface, randomBytes } from 'ethers'
import React, { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

import { Legends as LEGENDS_CONTRACT_ABI } from '@ambire-common/libs/humanizer/const/abis/Legends'
import ConfettiAnimation from '@common/modules/dashboard/components/ConfettiAnimation'
import { RELAYER_URL } from '@env'
import { LEGENDS_CONTRACT_ADDRESS } from '@legends/constants/addresses'
import { BASE_CHAIN_ID } from '@legends/constants/network'
import { ActivityTransaction, LegendActivity } from '@legends/contexts/recentActivityContext/types'
import useAccountContext from '@legends/hooks/useAccountContext'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useToast from '@legends/hooks/useToast'

import chainImage from './assets/chain.png'
// @ts-ignore
import CloseIcon from './assets/close.svg'
import mainImage from './assets/main.png'
import pointerImage from './assets/pointer.png'
import spinnerImage from './assets/spinner.png'
import styles from './WheelComponentModal.module.scss'
import WHEEL_PRIZE_DATA from './wheelData'

export const LEGENDS_CONTRACT_INTERFACE = new Interface(LEGENDS_CONTRACT_ABI)

interface WheelComponentProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

let fetchTryCount = 0
const WheelComponentModal: React.FC<WheelComponentProps> = ({ isOpen, setIsOpen }) => {
  const [prizeNumber, setPrizeNumber] = useState<null | number>(null)
  const [wheelState, setWheelState] = useState<
    'locked' | 'unlocking' | 'unlocked' | 'spinning' | 'spun'
  >('locked')
  const { connectedAccount } = useAccountContext()
  const { onLegendComplete } = useLegendsContext()
  const { addToast } = useToast()
  const spinnerRef = React.useRef<HTMLImageElement>(null)
  const chainRef = React.useRef<HTMLImageElement>(null)

  const stopSpinnerTeaseAnimation = useCallback(() => {
    if (!spinnerRef.current) return

    spinnerRef.current.style.animation = 'none'
    spinnerRef.current.style.transform = 'rotate(0deg)'
  }, [])

  const unlockChainAnimation = useCallback(() => {
    if (chainRef.current) chainRef.current.classList.add(styles.unlocked)
  }, [])

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

      unlockChainAnimation()
      setPrizeNumber(spinWheelActivity.xp)
      setWheelState('unlocked')
      return true
    } catch (error) {
      console.error('Error fetching transaction status:', error)
      return false
    }
  }, [wheelState, connectedAccount, unlockChainAnimation])

  const unlockWheel = useCallback(async () => {
    // Switch to Base chain
    await window.ambire.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID }]
    })

    const provider = new ethers.BrowserProvider(window.ambire)
    const signer = await provider.getSigner()

    try {
      stopSpinnerTeaseAnimation()
      setWheelState('unlocking')
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
              addToast(
                "We are unable to retrieve your prize at the moment. No worries, it will be displayed in your account's activity shortly.",
                'error'
              )
              // @TODO: Better way to handle this
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
      setWheelState('locked')
    }
  }, [stopSpinnerTeaseAnimation, checkTransactionStatus, addToast, onLegendComplete])

  const spinWheel = useCallback(async () => {
    if (!prizeNumber || wheelState !== 'unlocked') return

    // One prize can have multiple sectors
    const prizeSectors = WHEEL_PRIZE_DATA[prizeNumber]
    const amountOfSectors = prizeSectors.length
    // Select a random sector
    const randomSector = Math.floor(Math.random() * amountOfSectors)
    const sector = prizeSectors[randomSector]
    // Select a random point within the sector
    const randomDegrees = Math.floor(Math.random() * (sector.to - sector.from + 1) + sector.from)
    if (!spinnerRef.current) return

    // Start the animation
    spinnerRef.current.style.transform = `rotate(${-3960 + randomDegrees}deg)`
    setWheelState('spinning')

    setTimeout(() => {
      setWheelState('spun')
    }, 10000)
  }, [prizeNumber, wheelState])

  const onButtonClick = async () => {
    if (wheelState === 'locked') {
      await unlockWheel()
    } else if (wheelState === 'unlocked') {
      await spinWheel()
    }
  }

  const getButtonLabel = (): string => {
    switch (wheelState) {
      case 'unlocking':
        return 'Unlocking...'
      case 'unlocked':
        return 'Spin the Wheel'
      case 'spinning':
        return 'Spinning...'
      case 'spun':
        if (!prizeNumber) return 'We are unable to retrieve your prize at the moment'
        return `You won ${prizeNumber} xp`
      default:
        return 'Unlock the Wheel'
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className={styles.backdrop}>
      <div
        className={styles.wrapper}
        style={{
          backgroundImage: `url(${mainImage})`
        }}
      >
        <div className={styles.content}>
          {wheelState === 'spun' ? (
            <ConfettiAnimation width={650} height={500} autoPlay loop className={styles.confetti} />
          ) : null}
          <button type="button" onClick={() => setIsOpen(false)} className={styles.closeButton}>
            <img src={CloseIcon} width="32" height="32" alt="Close" />
          </button>
          <h2 className={styles.title}>Wheel of Fortune</h2>
          <img src={chainImage} ref={chainRef} alt="chain" className={styles.chain} />
          <img src={spinnerImage} alt="spinner" className={styles.spinner} ref={spinnerRef} />
          <img src={pointerImage} alt="pointer" className={styles.pointer} />
          <button
            disabled={wheelState !== 'locked' && wheelState !== 'unlocked'}
            type="button"
            className={styles.spinButton}
            onClick={onButtonClick}
          >
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  )
}

export default WheelComponentModal
