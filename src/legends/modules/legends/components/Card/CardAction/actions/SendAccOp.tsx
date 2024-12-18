import { BrowserProvider } from 'ethers'
import React, { FC, useCallback, useState } from 'react'

import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import useErc5792 from '@legends/hooks/useErc5792'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'
import { CardActionCalls } from '@legends/modules/legends/types'
import { humanizeLegendsBroadcastError } from '@legends/modules/legends/utils/errors/humanizeBroadcastError'

import CardActionButton from './CardActionButton'
import { CardProps } from './types'

type Props = CardProps & {
  action: CardActionCalls
}

const SendAccOp: FC<Props> = ({ onComplete, handleClose, action }) => {
  const { addToast } = useToast()
  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const [isInProgress, setIsInProgress] = useState(false)
  const switchNetwork = useSwitchNetwork()

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
    <CardActionButton
      isLoading={isInProgress}
      loadingText="Signing..."
      buttonText="Proceed"
      onButtonClick={onButtonClick}
    />
  )
}

export default React.memo(SendAccOp)
