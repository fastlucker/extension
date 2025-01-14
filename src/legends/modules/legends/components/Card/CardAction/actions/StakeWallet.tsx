/* eslint-disable no-console */
import { BrowserProvider, Contract, Interface } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'

import { WALLET_STAKING_ADDR, WALLET_TOKEN } from '@ambire-common/consts/addresses'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import { ETHEREUM_CHAIN_ID } from '@legends/constants/networks'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'
import { useCardActionContext } from '@legends/modules/legends/components/ActionModal'
import { humanizeLegendsBroadcastError } from '@legends/modules/legends/utils/errors/humanizeBroadcastError'

import CardActionWrapper from './CardActionWrapper'

const walletIface = new Interface([
  'function approve(address,uint)',
  'function balanceOf(address) view returns (uint256)'
])

const StakeWallet = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isInProgress, setIsInProgress] = useState(false)
  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const { onComplete, handleClose } = useCardActionContext()

  const { addToast } = useToast()
  const { connectedAccount } = useAccountContext()
  const switchNetwork = useSwitchNetwork(ETHEREUM_CHAIN_ID)

  const [walletBalance, setWalletBalance] = useState(null)

  useEffect(() => {
    const provider = new BrowserProvider(window.ethereum)
    const walletContract = new Contract(WALLET_TOKEN, walletIface, provider)
    // @TODO use the pending $WALLET balance in the future
    switchNetwork()
      .then(() =>
        walletContract
          .balanceOf(connectedAccount)
          .then(setWalletBalance)
          .catch((e) => {
            console.error(e)
            addToast('Failed to get $WALLET token balance', { type: 'error' })
          })
      )
      .catch((e) => {
        console.error(e)
        addToast('Failed to switch network to Ethereum', { type: 'error' })
      })
      .finally(() => setIsLoading(false))
  }, [connectedAccount, addToast, switchNetwork])

  const stakeWallet = useCallback(async () => {
    try {
      if (!connectedAccount) throw new Error('No connected account')
      if (!walletBalance) throw new Error('Insufficient $WALLET balance')

      setIsInProgress(true)
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner(connectedAccount)

      const useSponsorship = false

      const xWalletIface = new Interface(['function enter(uint)'])

      const sendCallsIdentifier = await sendCalls(
        chainId,
        await signer.getAddress(),
        [
          {
            to: WALLET_TOKEN,
            data: walletIface.encodeFunctionData('approve', [WALLET_STAKING_ADDR, walletBalance])
          },
          {
            to: WALLET_STAKING_ADDR,
            data: xWalletIface.encodeFunctionData('enter', [walletBalance])
          }
        ],
        useSponsorship
      )
      const receipt = await getCallsStatus(sendCallsIdentifier)
      onComplete(receipt.transactionHash)
      handleClose()
    } catch (e: any) {
      const message = humanizeLegendsBroadcastError(e)

      console.error(e)
      addToast(message || ERROR_MESSAGES.transactionSigningFailed, { type: 'error' })
    } finally {
      setIsInProgress(false)
    }
  }, [
    connectedAccount,
    walletBalance,
    sendCalls,
    chainId,
    getCallsStatus,
    onComplete,
    handleClose,
    addToast
  ])

  const onButtonClick = useCallback(async () => {
    if (!walletBalance) {
      await window.ambire
        .request({
          method: 'open-wallet-route',
          params: { route: 'swap-and-bridge' }
        })
        .catch((e) => {
          console.error(e)
          addToast(
            'This action is not supported in the current extension version. It’s available in version 4.44.1. Please update!',
            { type: 'error' }
          )
        })
      return
    }
    await switchNetwork()
    await stakeWallet()
  }, [switchNetwork, stakeWallet, walletBalance, addToast])

  return (
    <CardActionWrapper
      isLoading={isInProgress}
      loadingText="Signing..."
      disabled={isInProgress}
      buttonText={isLoading ? 'Loading...' : !walletBalance ? 'Buy $WALLET' : 'Stake'}
      onButtonClick={onButtonClick}
    />
  )
}

export default StakeWallet
