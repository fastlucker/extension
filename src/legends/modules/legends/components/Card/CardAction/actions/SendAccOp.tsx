import React, { FC, useCallback, useState } from 'react'
import useAccountContext from '@legends/hooks/useAccountContext'
import useToast from '@legends/hooks/useToast'
import { ETHEREUM_CHAIN_ID } from '@legends/constants/network'

import { CardAction } from '@legends/modules/legends/types'
import { BrowserProvider } from 'ethers'
import CardActionButton from './CardActionButton'

type Props = {
  onComplete: () => void
  action: CardAction
}

const SendAccOp: FC<Props> = ({ onComplete, action }) => {
  const { lastConnectedV2Account } = useAccountContext()
  const { addToast } = useToast()
  const [isInProgress, setIsInProgress] = useState(false)

  const changeNetworkToBase = useCallback(async () => {
    try {
      await window.ambire.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ETHEREUM_CHAIN_ID }]
      })
    } catch (e) {
      console.error(e)
      addToast('Failed to switch network', 'error')
    }
  }, [addToast])

  const onButtonClick = useCallback(async () => {
    if (!lastConnectedV2Account) return
    setIsInProgress(true)

    await changeNetworkToBase()

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const formattedCalls = action.calls!.map(([to, value, data]) => {
      return {
        to,
        value,
        data
      }
    })

    await window.ambire.request({
      method: 'wallet_sendCalls',
      params: [{ calls: formattedCalls, from: await signer.getAddress() }]
    })

    setIsInProgress(false)
    onComplete()
  }, [lastConnectedV2Account, changeNetworkToBase])

  return (
    <CardActionButton
      isLoading={isInProgress}
      loadingText="Signing..."
      buttonText="Proceed"
      onButtonClick={onButtonClick}
    />
  )
}

export default SendAccOp
