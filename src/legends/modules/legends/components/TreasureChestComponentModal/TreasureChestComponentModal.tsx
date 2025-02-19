import { BrowserProvider } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { preloadImages } from '@common/utils/images'
import CheckIcon from '@legends/common/assets/svg/CheckIcon'
import CoinIcon from '@legends/common/assets/svg/CoinIcon'
import CloseIcon from '@legends/components/CloseIcon'
import MidnightTimer from '@legends/components/MidnightTimer'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { checkTransactionStatus } from '@legends/modules/legends/helpers'
import { CardActionCalls, CardStatus, ChestCard } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils'
import { humanizeError } from '@legends/modules/legends/utils/errors/humanizeError'

import chainImage from './assets/chain-treasure-chest.png'
import chestImageOpened from './assets/chest-opened.png'
import chestImage from './assets/chest.png'
import starImage from './assets/star.png'
import streakImage from './assets/streak-modal.png'
import CongratsModal from './components/CongratsModal'
import styles from './TreasureChestComponentModal.module.scss'

interface TreasureChestComponentModalProps {
  isOpen: boolean
  handleClose: () => void
}

const TreasureChestComponentModal: React.FC<TreasureChestComponentModalProps> = ({
  isOpen,
  handleClose
}) => {
  const { addToast } = useToast()
  const { connectedAccount } = useAccountContext()
  const [isCongratsModalOpen, setCongratsModalOpen] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState<null | number>(null)

  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const chainRef = React.useRef<HTMLImageElement>(null)

  // Load the modal in the dom but don't show it immediately
  // This is done to preload all images
  useEffect(() => {
    preloadImages([chestImage, chainImage, chestImageOpened, starImage])
  }, [])

  const unlockChainAnimation = useCallback(() => {
    if (chainRef.current) chainRef.current.classList.add(styles.unlocked)
  }, [])

  const stopChainAnimation = useCallback(() => {
    if (chainRef.current) chainRef.current.classList.add(styles.unlocking)
  }, [])

  const switchNetwork = useSwitchNetwork()

  const { legends, getLegends } = useLegendsContext()

  const closeModal = async () => {
    handleClose()
  }

  const treasureLegend: ChestCard | undefined = useMemo(
    () =>
      legends.find((legend) => isMatchingPredefinedId(legend.action, CARD_PREDEFINED_ID.chest)) as
        | ChestCard
        | undefined,
    [legends]
  )

  const isCompleted = treasureLegend?.card.status === CardStatus.completed

  const [chestState, setChestState] = useState<
    'locked' | 'unlocking' | 'unlocked' | 'opening' | 'opened' | 'error'
  >(isCompleted ? 'opened' : 'locked')

  const buttonLabel = useMemo(() => {
    switch (chestState) {
      case 'unlocking':
        return 'Unlocking...'
      case 'unlocked':
        return 'Open chest'
      case 'error':
        return 'Close'
      case 'opening':
        return 'Opening...'
      case 'opened':
        return <MidnightTimer type="minutes" />
      default:
        return 'Unlock chest'
    }
  }, [chestState])

  const action = useMemo(() => treasureLegend?.action as CardActionCalls, [treasureLegend])

  const setStateOnTxnConfirmed = useCallback(
    async (receivedXp?: number) => {
      receivedXp && setPrizeNumber(receivedXp)
      unlockChainAnimation()
      setChestState('unlocked')
    },
    [unlockChainAnimation]
  )

  const unlockChest = useCallback(async () => {
    setChestState('unlocking')

    try {
      await switchNetwork()

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const formattedCalls = action.calls.map(([to, value, data]) => {
        return { to, value, data }
      })
      stopChainAnimation()

      const sendCallsIdentifier = await sendCalls(
        chainId,
        await signer.getAddress(),
        formattedCalls,
        false
      )

      addToast('The chest will be unlocked shortly. ETA 10s')

      await getCallsStatus(sendCallsIdentifier)

      const transactionFound = await checkTransactionStatus(
        connectedAccount,
        'dailyReward',
        setStateOnTxnConfirmed
      )
      if (!transactionFound) {
        const checkStatusWithTimeout = async (attempts: number) => {
          if (attempts >= 10) {
            console.error('Failed to fetch transaction status after 10 attempts')
            addToast(
              "We are unable to retrieve your prize at the moment. No worries, it will be displayed in your account's activity shortly.",
              { type: 'error' }
            )
            setChestState('error')
            return
          }
          const found = await checkTransactionStatus(
            connectedAccount,
            'dailyReward',
            setStateOnTxnConfirmed
          )

          if (!found) {
            setTimeout(() => checkStatusWithTimeout(attempts + 1), 1000)
          }
        }

        await checkStatusWithTimeout(0)
      }
    } catch (e: any) {
      const message = humanizeError(e, ERROR_MESSAGES.transactionProcessingFailed)
      setChestState('locked')

      console.error(e)
      addToast(message, { type: 'error' })
    }
  }, [
    switchNetwork,
    stopChainAnimation,
    connectedAccount,
    action?.calls,
    sendCalls,
    chainId,
    getCallsStatus,
    addToast,
    setStateOnTxnConfirmed
  ])

  const openChest = async () => {
    setChestState('opened')
    setCongratsModalOpen(true)
  }

  const onButtonClick = async () => {
    if (chestState === 'locked') {
      await unlockChest()
    } else if (chestState === 'unlocked') {
      await getLegends()
      await openChest()
    } else if (chestState === 'opened' || chestState === 'error') {
      await closeModal()
    }
  }

  const onCongratsModalButtonClick = async () => {
    setCongratsModalOpen(false)
  }

  if (!treasureLegend || !isOpen) {
    return null
  }

  return createPortal(
    <div>
      <div className={styles.backdrop}>
        <div className={styles.wrapper}>
          {!!treasureLegend.meta.streak && (
            <div className={styles.streak} style={{ backgroundImage: `url(${streakImage})` }}>
              <p className={styles.streakNumber}>{treasureLegend.meta.streak}</p>
              <p className={styles.streakLabel}>
                {treasureLegend.meta.streak === 1 ? 'Day' : 'Days'} Streak
              </p>
            </div>
          )}

          <div className={styles.header}>
            <h2 className={styles.heading}>Daily Loot</h2>
            <button type="button" onClick={closeModal} className={styles.closeButton}>
              <CloseIcon />
            </button>
          </div>
          <div className={styles.content}>
            {treasureLegend.meta.points.map((point, index) => {
              const streak = treasureLegend.meta.streak % 7
              const isOpened = isCompleted && chestState === 'opened'

              const isCurrentDay = isOpened
                ? streak - 1 === index
                : isCompleted
                ? streak - 1 === index
                : streak === index

              const isPassedDay = isOpened
                ? index < streak
                : isCompleted
                ? index < streak - 1 // Prevent marking next day as passed too soon
                : index < streak

              return (
                <div
                  key={point}
                  className={`${styles.day} 
                    ${isCurrentDay ? styles.current : ''} 
                    ${isPassedDay ? styles.passed : ''}`}
                >
                  <div className={styles.icon}>
                    {isPassedDay ? (
                      <CheckIcon width={20} height={20} />
                    ) : (
                      <>
                        +{point} <CoinIcon width={20} height={20} />
                      </>
                    )}
                  </div>
                  <p className={styles.dayText}>{isCurrentDay ? 'Today' : `Day ${index + 1}`}</p>
                </div>
              )
            })}
          </div>
          <div className={styles.chestWrapper}>
            <img src={chainImage} ref={chainRef} alt="chain" className={styles.chain} />
            <img src={chestImage} alt="spinner" className={styles.chest} />
          </div>
          <button
            type="button"
            className={styles.button}
            disabled={
              chestState === 'opening' || chestState === 'opened' || chestState === 'unlocking'
            }
            onClick={onButtonClick}
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      <CongratsModal
        isOpen={isCongratsModalOpen}
        setIsOpen={setCongratsModalOpen}
        prizeNumber={prizeNumber}
        onButtonClick={onCongratsModalButtonClick}
      />
    </div>,
    document.getElementById('modal-root') as HTMLElement
  )
}

export default TreasureChestComponentModal
