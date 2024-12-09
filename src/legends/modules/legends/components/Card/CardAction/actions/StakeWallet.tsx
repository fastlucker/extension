/* eslint-disable no-console */
import { BrowserProvider, Contract, Interface } from 'ethers'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'

import { WALLET_STAKING_ADDR, WALLET_TOKEN } from '@ambire-common/consts/addresses'
import { ETHEREUM_CHAIN_ID } from '@legends/constants/network'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'

import CardActionWrapper from './CardActionWrapper'

const linkToSwap = () =>
  Linking.openURL(
    'https://app.uniswap.org/explore/tokens/ethereum/0x88800092ff476844f74dc2fc427974bbee2794ae'
  )

type Props = {
  onComplete: () => void
}

const walletIface = new Interface([
  'function approve(address,uint)',
  'function balanceOf(address) view returns (uint)'
])

const StakeWallet: FC<Props> = ({ onComplete }) => {
  const [isInProgress, setIsInProgress] = useState(false)
  const { sendCalls, getCallsStatus, chainId } = useErc5792()

  const { addToast } = useToast()
  const { connectedAccount } = useAccountContext()
  const switchNetwork = useSwitchNetwork(ETHEREUM_CHAIN_ID)

  const [walletBalance, setWalletBalance] = useState()

  useEffect(() => {
    const provider = new BrowserProvider(window.ethereum)
    const walletContract = new Contract(WALLET_TOKEN, walletIface, provider)
    // @TODO use the pending $WALLET balance in the future
    walletContract
      .balanceOf(connectedAccount)
      .then(setWalletBalance)
      .catch((e) => {
        console.error(e)
        throw new Error('Failed to get WALLET balance')
      })
  }, [connectedAccount])

  const stakeWallet = useCallback(async () => {
    try {
      if (!connectedAccount) throw new Error('No connected account')

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
      if (receipt.status !== '0x1') throw new Error('Failed staking')
      onComplete()
    } catch (e) {
      console.error(e)
      addToast('Failed to sign transaction', 'error')
    } finally {
      setIsInProgress(false)
    }
  }, [connectedAccount, addToast, sendCalls, getCallsStatus, chainId, onComplete, walletBalance])

  const onButtonClick = useCallback(async () => {
    if (!walletBalance) return linkToSwap()
    await switchNetwork()
    await stakeWallet()
  }, [switchNetwork, stakeWallet, walletBalance])

  return (
    <CardActionWrapper
      isLoading={isInProgress}
      loadingText="Signing..."
      disabled={isInProgress}
      buttonText={walletBalance === 0n ? 'Buy $WALLET' : 'Stake'}
      onButtonClick={onButtonClick}
    />
  )
}

export default StakeWallet
