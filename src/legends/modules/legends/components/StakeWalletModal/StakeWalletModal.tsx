import { BrowserProvider, Contract, Interface, JsonRpcProvider } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { STK_WALLET, WALLET_TOKEN } from '@ambire-common/consts/addresses'
import NumberInput from '@common/components/NumberInput'
import getAndFormatTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import HumanReadableError from '@legends/classes/HumanReadableError'
import CloseIcon from '@legends/components/CloseIcon'
import Input from '@legends/components/Input'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import { ETHEREUM_CHAIN_ID } from '@legends/constants/networks'
import useAccountContext from '@legends/hooks/useAccountContext'
import useErc5792 from '@legends/hooks/useErc5792'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSwitchNetwork from '@legends/hooks/useSwitchNetwork'
import useToast from '@legends/hooks/useToast'
import { humanizeError } from '@legends/modules/legends/utils/errors/humanizeError'

import styles from './StakeWalletModal.module.scss'

const walletIface = new Interface([
  'function approve(address,uint)',
  'function balanceOf(address) view returns (uint256)'
])
const stkWalletIface = new Interface(['function enter(uint256 amount) external'])

interface StakeWalletModalProps {
  isOpen: boolean
  handleClose: () => void
}

const StakeWalletModal: React.FC<StakeWalletModalProps> = ({ isOpen, handleClose }) => {
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake')
  const [stakeAmount, setStakeAmount] = useState('')
  const [walletBalance, setWalletBalance] = useState<null | bigint>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInProgress, setIsInProgress] = useState(false)

  const { connectedAccount, v1Account } = useAccountContext()
  const { walletTokenInfo, walletTokenPrice } = usePortfolioControllerState()
  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const switchNetwork = useSwitchNetwork()
  const { addToast } = useToast()
  const disabledButton = Boolean(!connectedAccount || v1Account)

  useEffect(() => {
    if (!connectedAccount) return
    setIsLoading(true)
    const ethereumProvider = new JsonRpcProvider('https://invictus.ambire.com/ethereum')
    const walletContract = new Contract(WALLET_TOKEN, walletIface, ethereumProvider)
    walletContract
      .balanceOf(connectedAccount)
      .then((balance: bigint) => setWalletBalance(balance))
      .catch((e: any) => {
        console.error(e)
        addToast('Failed to get $WALLET token balance', { type: 'error' })
      })
      .finally(() => setIsLoading(false))
  }, [connectedAccount, addToast])

  const stakeWallet = useCallback(async () => {
    try {
      if (!connectedAccount) throw new HumanReadableError('No connected account.')
      if (!walletBalance || walletBalance === 0n)
        throw new HumanReadableError('Insufficient $WALLET balance')
      if (!stakeAmount || Number.isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0)
        throw new HumanReadableError('Enter a valid amount to stake')

      setIsInProgress(true)
      const provider = new BrowserProvider(window.ambire)
      const signer = await provider.getSigner(connectedAccount)
      const amountToStake = BigInt(Math.floor(Number(stakeAmount)))
      const useSponsorship = false

      const sendCallsIdentifier = await sendCalls(
        chainId,
        await signer.getAddress(),
        [
          {
            to: WALLET_TOKEN,
            data: walletIface.encodeFunctionData('approve', [STK_WALLET, amountToStake])
          },
          {
            to: STK_WALLET,
            data: stkWalletIface.encodeFunctionData('enter', [amountToStake])
          }
        ],
        useSponsorship
      )
      await getCallsStatus(sendCallsIdentifier)
      addToast('Stake successful!', { type: 'success' })
      handleClose()
    } catch (e: any) {
      const message = humanizeError(e, ERROR_MESSAGES.transactionSigningFailed)
      console.error(e)
      addToast(message, { type: 'error' })
    } finally {
      setIsInProgress(false)
    }
  }, [
    connectedAccount,
    walletBalance,
    stakeAmount,
    sendCalls,
    chainId,
    getCallsStatus,
    handleClose,
    addToast
  ])

  const onStakeButtonClick = useCallback(async () => {
    if (!walletBalance || walletBalance === 0n) {
      await window.ambire
        .request({
          method: 'open-wallet-route',
          params: { route: 'swap-and-bridge' }
        })
        .catch((e: any) => {
          console.error(e)
        })
      return
    }
    await switchNetwork(ETHEREUM_CHAIN_ID)
    await stakeWallet()
  }, [switchNetwork, stakeWallet, walletBalance])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.backdrop}>
      <div className={styles.wrapper}>
        <button type="button" onClick={handleClose} className={styles.closeButton}>
          <CloseIcon />
        </button>
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>Stake $WALLET</h2>
          <div className={styles.tabs}>
            <button
              type="button"
              className={activeTab === 'stake' ? styles.activeTab : ''}
              onClick={() => setActiveTab('stake')}
            >
              Stake
            </button>
            <button
              type="button"
              className={activeTab === 'unstake' ? styles.activeTab : ''}
              onClick={() => setActiveTab('unstake')}
              disabled
            >
              Unstake
            </button>
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.infoRow}>
              <div>
                <div className={styles.label}>Your $WALLET</div>
                <div className={styles.value}>
                  {isLoading
                    ? '...'
                    : walletBalance !== null &&
                      getAndFormatTokenDetails(
                        {
                          amount: walletBalance,
                          decimals: 18,
                          priceIn: [{ baseCurrency: 'usd', price: walletTokenPrice }],
                          flags: { rewardsType: 'wallet-rewards' }
                        },
                        [{ chainId: 1 }]
                      ).balanceFormatted}
                </div>
                <div className={styles.stakeValueUsd}>
                  {isLoading
                    ? '...'
                    : walletBalance !== null &&
                      getAndFormatTokenDetails(
                        {
                          amount: walletBalance,
                          decimals: 18,
                          priceIn: [{ baseCurrency: 'usd', price: walletTokenPrice }],
                          flags: { rewardsType: 'wallet-rewards' }
                        },
                        [{ chainId: 1 }]
                      ).balanceUSDFormatted}
                </div>
              </div>
              <div>
                <div className={styles.label}>APR</div>
                <div className={styles.value}>2.06%</div>
              </div>
            </div>
            <div className={styles.stakedTotalRow}>
              <div className={styles.label}>Staked Total</div>
              <div className={styles.value}>{walletTokenInfo?.stkWalletTotalSupply}</div>
            </div>
            <div className={styles.stakeInputRow}>
              <div className={styles.stakeInputRowWrapper}>
                <div className={styles.stakeInputLabel}>Stake</div>
                <span className={styles.stakeInputMax}>
                  {
                    getAndFormatTokenDetails(
                      {
                        amount: walletBalance,
                        decimals: 18,
                        priceIn: [{ baseCurrency: 'usd', price: walletTokenPrice }],
                        flags: { rewardsType: 'wallet-rewards' }
                      },
                      [{ chainId: 1 }]
                    ).balanceFormatted
                  }{' '}
                  $WALLET{' '}
                  <button
                    type="button"
                    className={styles.stakeInputMaxButton}
                    onClick={() => setStakeAmount(walletBalance?.toString() || '0')}
                  >
                    MAX
                  </button>
                </span>
              </div>
              <Input
                value={
                  getAndFormatTokenDetails(
                    {
                      amount: stakeAmount,
                      decimals: 18,
                      priceIn: [{ baseCurrency: 'usd', price: walletTokenPrice }],
                      flags: { rewardsType: 'wallet-rewards' }
                    },
                    [{ chainId: 1 }]
                  ).balanceFormatted
                }
                onChange={(e) => setStakeAmount(e.target.value)}
                className={styles.stakeInput}
                placeholder="0.00"
                disabled={isLoading || disabledButton || isInProgress}
              />
            </div>
            <div className={styles.stakeValueUsd}>
              {isLoading
                ? '...'
                : stakeAmount !== null &&
                  getAndFormatTokenDetails(
                    {
                      amount: stakeAmount,
                      decimals: 18,
                      priceIn: [{ baseCurrency: 'usd', price: walletTokenPrice }],
                      flags: { rewardsType: 'wallet-rewards' }
                    },
                    [{ chainId: 1 }]
                  ).balanceUSDFormatted}
            </div>
          </div>
          <button
            type="button"
            className={styles.stakeButton}
            onClick={onStakeButtonClick}
            disabled={
              disabledButton || isLoading || isInProgress || !walletBalance || walletBalance === 0n
            }
          >
            {isInProgress
              ? 'Signing...'
              : disabledButton
              ? 'Switch to a new account to unlock Rewards quests. Ambire legacy Web accounts (V1) are not supported.'
              : isLoading
              ? 'Loading...'
              : !walletBalance || walletBalance === 0n
              ? 'Buy $WALLET'
              : 'Stake'}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  )
}

export default StakeWalletModal
