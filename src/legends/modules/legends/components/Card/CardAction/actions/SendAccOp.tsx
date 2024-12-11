import { BrowserProvider } from 'ethers'
import React, { FC, useCallback, useState } from 'react'

import { BASE_CHAIN_ID } from '@legends/constants/network'
import useErc5792 from '@legends/hooks/useErc5792'
import useToast from '@legends/hooks/useToast'
import { CardActionCalls } from '@legends/modules/legends/types'

import CardActionButton from './CardActionButton'
import { CardProps } from './types'

type Props = CardProps & {
  action: CardActionCalls
}

const SendAccOp: FC<Props> = ({ onComplete, handleClose, action }) => {
  const { addToast } = useToast()
  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const [isInProgress, setIsInProgress] = useState(false)

  const changeNetworkToBase = useCallback(async () => {
    try {
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }]
      })
    } catch (e) {
      console.error(e)
      addToast('Failed to switch network', 'error')
    }
  }, [addToast])

  const onButtonClick = useCallback(async () => {
    setIsInProgress(true)

    await changeNetworkToBase()

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
      if (receipt.status !== '0x1') throw new Error('Failed to process the transaction!')

      onComplete(receipt.transactionHash)
      handleClose()
    } catch (e) {
      console.error(e)
      addToast('Failed to process the transaction!', 'error')
    }
  }, [
    changeNetworkToBase,
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
