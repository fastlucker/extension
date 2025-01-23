import { BrowserProvider } from 'ethers'
import React, { useCallback, useMemo, useState } from 'react'

import CoinIcon from '@legends/common/assets/svg/CoinIcon'
import TreasureChestClosed from '@legends/common/assets/svg/TreasureChestClosed'
import TreasureChestOpened from '@legends/common/assets/svg/TreasureChestOpened'
import Modal from '@legends/components/Modal'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'
import { timeUntilMidnight } from '@legends/modules/legends/components/WheelComponentModal/helpers'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { checkTransactionStatus } from '@legends/modules/legends/helpers'
import { CardActionCalls, CardStatus, ChestCard } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils'
import { humanizeLegendsBroadcastError } from '@legends/modules/legends/utils/errors/humanizeBroadcastError'

import styles from './TreasureChestComponentModal.module.scss'

interface TreasureChestComponentModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TreasureChestComponentModal: React.FC<TreasureChestComponentModalProps> = ({
  isOpen,
  setIsOpen
}) => {
  const { addToast } = useToast()
  const { connectedAccount } = useAccountContext()
  const [isInProgress, setIsInProgress] = useState(false)
  const { sendCalls, getCallsStatus, chainId } = useErc5792()

  const switchNetwork = useSwitchNetwork()

  const { legends, getLegends } = useLegendsContext()

  const treasureLegend: ChestCard | undefined = useMemo(
    () =>
      legends.find((legend) => isMatchingPredefinedId(legend.action, CARD_PREDEFINED_ID.chest)) as
        | ChestCard
        | undefined,
    [legends]
  )

  if (!treasureLegend) {
    return null
  }

  const isCompleted = treasureLegend.card.status === CardStatus.completed

  const getButtonLabel = () => {
    if (isInProgress) {
      return 'Opening...'
    }

    if (isCompleted) {
      return `${timeUntilMidnight().label}`
    }

    return 'Open chest'
  }

  const action = treasureLegend.action as CardActionCalls

  const onButtonClick = useCallback(async () => {
    setIsInProgress(true)

    await switchNetwork()

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const formattedCalls = action.calls.map(([to, value, data]) => {
      return { to, value, data }
    })

    try {
      const sendCallsIdentifier = await sendCalls(
        chainId,
        await signer.getAddress(),
        formattedCalls,
        false
      )

      addToast('The chest will be opened shortly. ETA 10s')

      await getCallsStatus(sendCallsIdentifier)

      const transactionFound = await checkTransactionStatus(
        connectedAccount,
        'dailyReward',
        getLegends,
        setIsInProgress,
        addToast
      )
      if (!transactionFound) {
        const checkStatusWithTimeout = async (attempts: number) => {
          if (attempts >= 10) {
            console.error('Failed to fetch transaction status after 10 attempts')
            addToast(
              "We are unable to retrieve your prize at the moment. No worries, it will be displayed in your account's activity shortly.",
              { type: 'error' }
            )
            return
          }
          const found = await checkTransactionStatus(
            connectedAccount,
            'dailyReward',
            getLegends,
            setIsInProgress,
            addToast
          )

          if (!found) {
            setTimeout(() => checkStatusWithTimeout(attempts + 1), 1000)
          }
        }

        await checkStatusWithTimeout(0)
      }
    } catch (e: any) {
      const message = humanizeLegendsBroadcastError(e)
      setIsInProgress(false)

      console.error(e)
      addToast(message || ERROR_MESSAGES.transactionProcessingFailed, { type: 'error' })
    }
  }, [
    switchNetwork,
    connectedAccount,
    getLegends,
    action?.calls,
    sendCalls,
    chainId,
    getCallsStatus,
    addToast
  ])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className={styles.wrapper}>
      <Modal.Heading className={styles.heading}>Daily Loot</Modal.Heading>
      <div className={styles.content}>
        {treasureLegend.meta.points.map((point, index) => (
          <div
            key={point}
            className={index === (treasureLegend.meta.points.length ?? 0) - 1 ? styles.last : ''}
          >
            <div
              className={`${styles.day}  ${
                (!isCompleted && index === treasureLegend.meta.streak) ||
                index < (treasureLegend.meta.streak ?? -1)
                  ? styles.current
                  : ''
              }`}
            >
              <div className={styles.icon}>
                +{point} <CoinIcon width={20} height={20} />
              </div>
              <p className={styles.dayText}>
                {(isCompleted && (treasureLegend.meta.streak ?? 0) - 1 === index) ||
                (!isCompleted && treasureLegend.meta.streak === index)
                  ? 'Today'
                  : `Day ${index + 1}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.treasureChestWrapper}>
        {isCompleted ? (
          <>
            <div className={styles.prize}>
              +{treasureLegend.meta.points[treasureLegend.meta.streak - 1] || 0}
              <CoinIcon width={28} height={28} />{' '}
            </div>
            <TreasureChestOpened width={238} height={178} className={styles.treasureChest} />
          </>
        ) : (
          <TreasureChestClosed
            width={165}
            height={125}
            className={`${styles.treasureChest} ${styles.treasureChestClosed}`}
          />
        )}
      </div>
      <button
        type="button"
        className={styles.button}
        disabled={isCompleted || isInProgress}
        onClick={onButtonClick}
      >
        {getButtonLabel()}
      </button>
    </Modal>
  )
}

export default TreasureChestComponentModal
