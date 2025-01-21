import { BrowserProvider } from 'ethers'
import React, { useCallback, useMemo, useState } from 'react'

import { RELAYER_URL } from '@env'
import CoinIcon from '@legends/common/assets/svg/CoinIcon'
import TreasureChestClosed from '@legends/common/assets/svg/TreasureChestClosed'
import TreasureChestOpened from '@legends/common/assets/svg/TreasureChestOpened'
import Modal from '@legends/components/Modal'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import { ActivityTransaction, LegendActivity } from '@legends/contexts/recentActivityContext/types'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'
import { timeUntilMidnight } from '@legends/modules/legends/components/WheelComponentModal/helpers'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardActionCalls, CardStatus } from '@legends/modules/legends/types'
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
  const treasureLegend = useMemo(
    () => legends.find((legend) => isMatchingPredefinedId(legend.action, CARD_PREDEFINED_ID.chest)),
    [legends, isInProgress]
  )

  const isCompleted = treasureLegend?.card.status === CardStatus.completed

  console.log('treasureLegend', treasureLegend, 'isCompleted', isCompleted)
  const action = treasureLegend?.action as CardActionCalls

  const checkTransactionStatus = useCallback(async () => {
    try {
      const response = await fetch(`${RELAYER_URL}/legends/activity/${connectedAccount}`)

      if (!response.ok) throw new Error('Failed to fetch transaction status')

      const data = await response.json()
      const today = new Date().toISOString().split('T')[0]
      const transaction: ActivityTransaction | undefined = data.transactions.find(
        (txn: ActivityTransaction) =>
          txn.submittedAt.startsWith(today) &&
          txn.legends.activities &&
          txn.legends.activities.some((activity: LegendActivity) =>
            activity.action.startsWith('dailyReward')
          )
      )

      if (!transaction) return false
      const dailyRewardActivity = transaction.legends.activities.find((activity: any) => {
        return activity.action.includes('dailyReward')
      })

      if (!dailyRewardActivity) return false

      await getLegends()
      setIsInProgress(false)
      addToast(`You received ${dailyRewardActivity.xp}xp!`, {
        type: 'success'
      })
      return true
    } catch (error) {
      console.error('Error fetching transaction status:', error)
      return false
    }
  }, [connectedAccount, addToast, getLegends])

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
      await getCallsStatus(sendCallsIdentifier)

      const transactionFound = await checkTransactionStatus()
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
          const found = await checkTransactionStatus()

          if (!found) {
            setTimeout(() => checkStatusWithTimeout(attempts + 1), 1000)
          }
        }

        await checkStatusWithTimeout(0)
      }
    } catch (e: any) {
      const message = humanizeLegendsBroadcastError(e)

      console.error(e)
      addToast(message || ERROR_MESSAGES.transactionProcessingFailed, { type: 'error' })
    }
  }, [
    switchNetwork,
    action?.calls,
    sendCalls,
    chainId,
    getCallsStatus,
    addToast,
    checkTransactionStatus
  ])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className={styles.wrapper}>
      <Modal.Heading className={styles.heading}>Daily Loot</Modal.Heading>
      <div className={styles.content}>
        {treasureLegend?.meta?.points.map((point, index) => (
          <div
            key={point}
            className={index === (treasureLegend?.meta?.points?.length ?? 0) - 1 ? styles.last : ''}
          >
            <div
              className={`${styles.day}  ${
                index === (treasureLegend.meta?.streak ?? -1) ||
                index < (treasureLegend?.meta?.streak ?? -1)
                  ? styles.current
                  : ''
              }`}
            >
              <div className={styles.icon}>
                +{point} <CoinIcon width={20} height={20} />
              </div>
              <p className={styles.dayText}>
                {treasureLegend?.meta?.streak === index &&
                new Date(treasureLegend.meta.expiresOrResetsAt).toDateString() !==
                  new Date().toDateString()
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
              +{treasureLegend?.meta?.points[treasureLegend.meta.streak - 1] || 0}
              <CoinIcon width={28} height={28} />{' '}
            </div>
            <TreasureChestOpened width={238} height={178} className={styles.treasureChest} />
          </>
        ) : (
          <TreasureChestClosed width={165} height={125} className={styles.treasureChest} />
        )}
      </div>
      <button
        type="button"
        className={styles.button}
        disabled={isCompleted}
        onClick={onButtonClick}
      >
        {!isCompleted ? 'Open chest' : `${timeUntilMidnight().label}`}
      </button>
    </Modal>
  )
}

export default TreasureChestComponentModal
