import { BrowserProvider } from 'ethers'
import React, { useCallback, useState } from 'react'

import CoinIcon from '@legends/common/assets/svg/CoinIcon'
import TreasureChestClosed from '@legends/common/assets/svg/TreasureChestClosed'
import TreasureChestOpened from '@legends/common/assets/svg/TreasureChestOpened'
import Modal from '@legends/components/Modal'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useErc5792 from '@legends/hooks/useErc5792'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'
import { useCardActionContext } from '@legends/modules/legends/components/ActionModal'
import { humanizeLegendsBroadcastError } from '@legends/modules/legends/utils/errors/humanizeBroadcastError'

import styles from './TreasureChestComponentModal.module.scss'

interface TreasureChestComponentModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const TreasureChestComponentModal: React.FC<TreasureChestComponentModalProps> = ({
  isOpen,
  setIsOpen
}) => {
  const { addToast } = useToast()
  const [isInProgress, setIsInProgress] = useState(false)
  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const { onComplete, handleClose } = useCardActionContext()
  const isTresureChestOpenedForToday = false
  const switchNetwork = useSwitchNetwork()

  const { legends } = useLegendsContext()
  const treasureLegend = legends.find((legend) => legend.id === 'chest')
  const action = treasureLegend?.action

  const onButtonClick = useCallback(async () => {
    setIsInProgress(true)

    await switchNetwork()

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const formattedCalls = action.calls.map(([to, value, data]) => {
      return { to, value, data }
    })

    setIsInProgress(false)

    try {
      const sendCallsIdentifier = await sendCalls(
        chainId,
        await signer.getAddress(),
        formattedCalls,
        false
      )
      const receipt = await getCallsStatus(sendCallsIdentifier)

      onComplete(receipt.transactionHash)
      handleClose()
    } catch (e: any) {
      const message = humanizeLegendsBroadcastError(e)

      console.error(e)
      addToast(message || ERROR_MESSAGES.transactionProcessingFailed, { type: 'error' })
    }
  }, [
    switchNetwork,
    action.calls,
    sendCalls,
    chainId,
    getCallsStatus,
    onComplete,
    handleClose,
    addToast
  ])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className={styles.wrapper}>
      <Modal.Heading className={styles.heading}>Daily Loot</Modal.Heading>
      <div className={styles.content}>
        {treasureLegend?.meta?.points.map((point, index) => (
          <div
            key={index}
            className={index === treasureLegend.meta.points.length - 1 ? styles.last : ''}
          >
            <div
              className={`${styles.day}  ${
                index === treasureLegend.meta.streak ? styles.current : ''
              }`}
            >
              <div className={styles.icon}>
                +{point} <CoinIcon width={20} height={20} />
              </div>
              <p className={styles.dayText}>
                {treasureLegend.meta.streak === index ? 'Today' : `Day ${index + 1}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.treasureChestWrapper}>
        {isTresureChestOpenedForToday ? (
          <>
            <div className={styles.prize}>
              +20 <CoinIcon width={28} height={28} />{' '}
            </div>
            <TreasureChestOpened width={238} height={178} className={styles.treasureChest} />
          </>
        ) : (
          <TreasureChestClosed width={165} height={125} className={styles.treasureChest} />
        )}
      </div>
      <button type="button" className={styles.button} onClick={onButtonClick}>
        Open chest
      </button>
    </Modal>
  )
}

export default TreasureChestComponentModal
