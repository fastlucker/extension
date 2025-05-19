import { BrowserProvider, Contract, formatUnits, Interface, JsonRpcProvider } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { STK_WALLET, WALLET_TOKEN } from '@ambire-common/consts/addresses'
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

const convertToBigInt = (value: string): bigint => {
  try {
    const clean = value.replace(/,/g, '')
    const num = Number(clean)
    return isNaN(num) ? 0n : BigInt(Math.floor(num * 1e18))
  } catch {
    return 0n
  }
}

const formatBalance = (value: bigint): string => {
  const num = Number(value) / 1e18
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const StakeWalletModal: React.FC<{ isOpen: boolean; handleClose: () => void }> = ({ isOpen, handleClose }) => {
  const [stakeAmount, setStakeAmount] = useState('')
  const [walletBalance, setWalletBalance] = useState<bigint | null>(0n)
  const [loading, setLoading] = useState(true)
  const [inProgress, setInProgress] = useState(false)

  const { connectedAccount, v1Account } = useAccountContext()
  const { walletTokenInfo, walletTokenPrice } = usePortfolioControllerState()
  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const switchNetwork = useSwitchNetwork()
  const { addToast } = useToast()

  const isConnected = !!connectedAccount && !v1Account
  const isEmpty = !walletBalance || walletBalance === 0n

  useEffect(() => {
    if (!connectedAccount) {
      setLoading(false)
      return
    }
    setLoading(true)
    new Contract(WALLET_TOKEN, walletIface, new JsonRpcProvider('https://invictus.ambire.com/ethereum'))
      .balanceOf(connectedAccount)
      .then(setWalletBalance)
      .catch(() => addToast('Failed to get $WALLET token balance', { type: 'error' }))
      .finally(() => setLoading(false))
  }, [connectedAccount, addToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*(\.\d{0,18})?$/.test(value) || value === '') setStakeAmount(value)
  }

  const handleMaxClick = () => {
    if (!walletBalance) return
    setStakeAmount(parseFloat(formatUnits(walletBalance, 18)).toFixed(2))
  }

  const formattedUSD = (value: string | bigint) =>
    getAndFormatTokenDetails(
      {
        amount: typeof value === 'string' ? convertToBigInt(value) : value,
        decimals: 18,
        priceIn: [{ baseCurrency: 'usd', price: walletTokenPrice || 0 }],
        flags: { rewardsType: 'wallet-rewards' }
      },
      [{ chainId: 1 }]
    ).balanceUSDFormatted

  const stakeWallet = useCallback(async () => {
    try {
      if (!connectedAccount) throw new HumanReadableError('No connected account.')
      if (isEmpty) throw new HumanReadableError('Insufficient $WALLET balance')
      if (!stakeAmount || Number(stakeAmount) <= 0) throw new HumanReadableError('Enter a valid amount')

      setInProgress(true)
      const signer = await new BrowserProvider(window.ambire).getSigner(connectedAccount)
      const amount = convertToBigInt(stakeAmount)

      const txId = await sendCalls(
        chainId,
        await signer.getAddress(),
        [
          { to: WALLET_TOKEN, data: walletIface.encodeFunctionData('approve', [STK_WALLET, amount]) },
          { to: STK_WALLET, data: stkWalletIface.encodeFunctionData('enter', [amount]) }
        ],
        false
      )
      await getCallsStatus(txId)
      addToast('Stake successful!', { type: 'success' })
      handleClose()
    } catch (e: any) {
      addToast(humanizeError(e, ERROR_MESSAGES.transactionSigningFailed), { type: 'error' })
    } finally {
      setInProgress(false)
    }
  }, [connectedAccount, isEmpty, stakeAmount, sendCalls, chainId, getCallsStatus, handleClose, addToast])

  const handleStakeClick = async () => {
    if (isEmpty) {
      await window.ambire.request({ method: 'open-wallet-route', params: { route: 'swap-and-bridge' } })
    } else {
      await switchNetwork(ETHEREUM_CHAIN_ID)
      await stakeWallet()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className={styles.backdrop}>
      <div className={styles.wrapper}>
        <button className={styles.closeButton} onClick={handleClose}><CloseIcon /></button>
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>Stake $WALLET</h2>
          <div className={styles.infoWrapper}>
            <div className={styles.infoRow}>
              <div>
                <div className={styles.label}>Your $WALLET</div>
                <div className={styles.value}>{loading ? '...' : walletBalance !== null ? formatBalance(walletBalance) : null}</div>
                <div className={styles.stakeValueUsd}>{loading ? '...' : walletBalance ? formattedUSD(walletBalance) : null}</div>
              </div>
              <div>
                <div className={styles.label}>APR</div>
                <div className={styles.value}>2.06%</div>
              </div>
            </div>
            <div className={styles.stakedTotalRow}>
              <div className={styles.label}>Staked Total</div>
              {Number(walletTokenInfo?.stkWalletTotalSupply || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className={styles.stakeInputRow}>
              <div className={styles.stakeInputRowWrapper}>
                <div className={styles.stakeInputLabel}>Stake</div>
                <span className={styles.stakeInputMax}>
                  {walletBalance ? formatBalance(walletBalance) : ''} $WALLET {' '}
                  <button className={styles.stakeInputMaxButton} onClick={handleMaxClick} disabled={isEmpty}>MAX</button>
                </span>
              </div>
              <Input
                value={stakeAmount}
                disabled={isEmpty}
                onChange={handleInputChange}
                className={styles.stakeInput}
                placeholder="0.00"
              />
              <div className={styles.stakeInputValueUsd}>{stakeAmount && formattedUSD(stakeAmount)}</div>
            </div>
          </div>
          <button
            className={styles.stakeButton}
            onClick={handleStakeClick}
            disabled={!isConnected || loading || inProgress || isEmpty || !stakeAmount}
          >
            {inProgress
              ? 'Signing...'
              : !isConnected
              ? 'Switch to a new account to unlock Rewards quests.'
              : loading
              ? 'Loading...'
              : 'Stake'}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  )
}

export default StakeWalletModal
