import {
  AbiCoder,
  BrowserProvider,
  Contract,
  formatUnits,
  Interface,
  JsonRpcProvider,
  keccak256,
  parseEther,
  parseUnits
} from 'ethers'
import LottieView from 'lottie-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { STK_WALLET, WALLET_STAKING_ADDR, WALLET_TOKEN } from '@ambire-common/consts/addresses'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import InfoIcon from '@common/assets/svg/InfoIcon/InfoIcon'
import { RELAYER_URL } from '@env'
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

import loadingAnimation from './icons/LoadingAnimation.json'
import styles from './StakeWalletModal.module.scss'

const walletIface = new Interface([
  'function approve(address,uint)',
  'function balanceOf(address) view returns (uint256)'
])

const stkWalletIface = new Interface([
  'function unwrap(uint256 shareAmount)',
  'function enter(uint256 amount) external',
  'function balanceOf(address) view returns (uint256)'
])
const xWalletIface = new Interface([
  'function shareValue() public view returns(uint)',
  'function leave(uint256 shares, bool skipMint)',
  'function lockedShares(address) public view returns(uint)',
  'function commitments(bytes32) public view returns(uint)',
  'event LogLeave(address indexed owner, uint256 shares, uint256 unlocksAt, uint256 maxTokens)',
  'function balanceOf(address) view returns (uint256)',
  'function withdraw(uint shares, uint unlocksAt, bool skipMint) external'
])

function goToAPYArticle() {
  window.open('https://blog.ambire.com/migrate-to-stkwallet/', '_blank')
}
const StakeWalletModal: React.FC<{ isOpen: boolean; handleClose: () => void }> = ({
  isOpen,
  handleClose
}) => {
  const [inputAmount, setInputAmount] = useState('')
  const [onchainData, setOnchainData] = useState<{
    walletBalance: bigint
    shareValue: bigint
    lockedShares: bigint
    stkWalletBalance: bigint
    xWalletBalance: bigint
  } | null>()
  // const [logEvents, setLogEvents] = useState(null)
  const [isLoadingOnchainData, setIsLoadingOnchainData] = useState(true)
  const [isLoadingLogs, setIsLoadingLogs] = useState(true)
  const [isSigning, setIsSigning] = useState(false)
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake')
  const [leaveLogs, setLeaveLogs] = useState<{ topics: string[]; data: string }[] | null>(null)
  const [firstToCollect, setFirstToCollect] = useState<null | {
    unlocksAt: bigint
    maxTokens: bigint
    shares: bigint
  }>(null)
  const { connectedAccount, v1Account } = useAccountContext()
  const { walletTokenInfo } = usePortfolioControllerState()
  const { sendCalls, getCallsStatus, chainId } = useErc5792()
  const switchNetwork = useSwitchNetwork()
  const { addToast } = useToast()

  const isConnected = useMemo(() => !!connectedAccount && !v1Account, [connectedAccount, v1Account])

  useEffect(() => {
    if (!isConnected || !isOpen) {
      setIsLoadingOnchainData(false)
      return
    }
    setIsLoadingOnchainData(true)
    const provider = new JsonRpcProvider('https://invictus.ambire.com/ethereum')
    const walletContract = new Contract(WALLET_TOKEN, walletIface, provider)
    const xWalletContract = new Contract(WALLET_STAKING_ADDR, xWalletIface, provider)
    const stkWalletContract = new Contract(STK_WALLET, stkWalletIface, provider)
    Promise.all([
      walletContract.balanceOf(connectedAccount),
      xWalletContract.shareValue(),
      stkWalletContract.balanceOf(connectedAccount),
      xWalletContract.lockedShares(connectedAccount),
      xWalletContract.balanceOf(connectedAccount)
    ])
      .then(([walletBalance, shareValue, stkWalletBalance, lockedShares, xWalletBalance]) =>
        setOnchainData({
          walletBalance,
          shareValue,
          stkWalletBalance,
          lockedShares,
          xWalletBalance
        })
      )
      .catch(() => addToast('Failed to fetch token data.', { type: 'error' }))
      .finally(() => setIsLoadingOnchainData(false))
  }, [connectedAccount, addToast, isConnected, isOpen])

  useEffect(() => {
    if (!isConnected || !isOpen) return setIsLoadingLogs(false)
    setIsLoadingLogs(true)

    fetch(`${RELAYER_URL}/v2/identity/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: connectedAccount,
        address: WALLET_STAKING_ADDR,
        requestedTopic: xWalletIface.getEvent('LogLeave')!.topicHash
      })
    })
      .then((res) => res.json())
      .then(({ success, message, data }) => {
        if (!success) addToast(`Getting unstake logs: ${message}`, { type: 'error' })
        else setLeaveLogs(data?.logs)
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err))
  }, [isConnected, isOpen, connectedAccount, addToast])
  useEffect(() => {
    if (onchainData) return
    if (!leaveLogs) return
    const parsedLogs = leaveLogs
      .filter(
        ({ topics }) =>
          // just in case tthe relayer implementation changes
          topics[0] === xWalletIface.getEvent('LogLeave')!.topicHash
      )
      .map(({ topics, data }) => {
        const { owner, shares, unlocksAt, maxTokens } = xWalletIface.decodeEventLog(
          'LogLeave',
          data,
          topics
        )
        return { owner, shares, unlocksAt, maxTokens }
      })
      .filter(({ owner }) => owner === connectedAccount)
    const provider = new JsonRpcProvider('https://invictus.ambire.com/ethereum')
    const xWalletContract = new Contract(WALLET_STAKING_ADDR, xWalletIface, provider)

    Promise.all(
      parsedLogs.map(({ shares, owner, unlocksAt }) => {
        const abiCoder = new AbiCoder()
        const encoded = abiCoder.encode(
          ['address', 'uint256', 'uint256'],
          [owner, shares, unlocksAt]
        )
        const commitmentId = keccak256(encoded)
        return xWalletContract
          .commitments(commitmentId)
          .then((maxTokens) => [maxTokens, { shares, owner, unlocksAt, maxTokens }])
      })
    )
      .then((allCommitments) => {
        const uncollected = allCommitments
          .filter(([maxTokens]) => maxTokens)
          .map(([, commitment]) => commitment)
          .sort(([a, b]) => a.unlocksAt - b.unlocksAt)

        const firstUncollected = uncollected[0]
        if (!firstUncollected) return
        const { maxTokens, unlocksAt, shares } = firstUncollected
        setFirstToCollect({ unlocksAt, maxTokens, shares })
      })
      .catch(() => addToast('Error getting pending withdraw data', { type: 'error' }))
      .finally(() => setIsLoadingLogs(false))
  }, [addToast, connectedAccount, firstToCollect, leaveLogs, onchainData])

  const toWithdraw = useMemo(() => {
    return onchainData?.lockedShares && activeTab === 'unstake'
  }, [activeTab, onchainData])

  useEffect(() => {}, [])

  const formatToken = useCallback(
    (value: bigint): { usd: string; token: string } => {
      const tokenAsNumber = parseFloat(formatUnits(value, 18))

      const balanceUSD = (walletTokenInfo?.walletPrice || 0) * tokenAsNumber
      const usd = formatDecimals(balanceUSD, 'value')
      const token = formatDecimals(tokenAsNumber, 'amount')

      return { usd, token }
    },
    [walletTokenInfo]
  )

  const handleCloseClick = () => {
    setInputAmount('')
    handleClose()
  }

  const shouldWaitWithdraw = useMemo(() => {
    if (!firstToCollect) return false
    const { unlocksAt } = firstToCollect
    const time = new Date(Number(unlocksAt * 1000n))
    return time > new Date()
  }, [firstToCollect])

  const handleAction = useCallback(async () => {
    try {
      if (!connectedAccount) throw new HumanReadableError('No connected account.')
      if (isLoadingLogs || isLoadingOnchainData) throw new HumanReadableError('Still loading.')
      if (isSigning) throw new HumanReadableError('In progress.')
      if (!onchainData) throw new HumanReadableError('No token data available.')
      const { walletBalance, shareValue } = onchainData

      await switchNetwork(ETHEREUM_CHAIN_ID)
      let calls: { to: string; data: string }[] = []
      if (activeTab === 'stake') {
        if (!walletBalance) {
          return await window.ambire
            .request({
              method: 'open-wallet-route',
              params: { route: 'swap-and-bridge' }
            })
            .catch((e) => {
              // eslint-disable-next-line no-console
              console.error(e)
            })
        }
        if (!inputAmount) throw new HumanReadableError('Enter a valid amount.')

        const amount = parseEther(inputAmount)

        calls = [
          {
            to: WALLET_TOKEN,
            data: walletIface.encodeFunctionData('approve', [STK_WALLET, amount])
          },
          { to: STK_WALLET, data: stkWalletIface.encodeFunctionData('enter', [amount]) }
        ]
      } else if (!toWithdraw) {
        if (!inputAmount) throw new HumanReadableError('Enter a valid amount.')
        const amount = parseUnits(inputAmount, 36) / shareValue
        calls = [
          { to: STK_WALLET, data: stkWalletIface.encodeFunctionData('unwrap', [amount]) },
          {
            to: WALLET_STAKING_ADDR,
            data: xWalletIface.encodeFunctionData('leave', [amount, false])
          }
        ]
      } else if (!shouldWaitWithdraw) {
        if (!firstToCollect) return addToast('We failed to get unstaking data', { type: 'error' })
        const { shares, unlocksAt } = firstToCollect
        if (onchainData.xWalletBalance < onchainData.lockedShares)
          throw new HumanReadableError(
            'The $xWALLET tokens you are trying to unlock are not in this account'
          )
        calls = [
          {
            to: WALLET_STAKING_ADDR,
            data: xWalletIface.encodeFunctionData('withdraw', [shares, unlocksAt, true])
          }
        ]
      } else if (!inputAmount) throw new HumanReadableError('should wait for unlock time.')

      setIsSigning(true)
      const signer = await new BrowserProvider(window.ambire).getSigner(connectedAccount)

      const txId = await sendCalls(chainId, await signer.getAddress(), calls, false)
      await getCallsStatus(txId)
      addToast('Stake successful!', { type: 'success' })
      handleClose()
      setInputAmount('')
    } catch (e: any) {
      console.log(e)
      addToast(humanizeError(e, ERROR_MESSAGES.transactionSigningFailed), { type: 'error' })
    } finally {
      setIsSigning(false)
    }
  }, [
    connectedAccount,
    inputAmount,
    isLoadingLogs,
    isLoadingOnchainData,
    isSigning,
    onchainData,
    switchNetwork,
    activeTab,
    toWithdraw,
    firstToCollect,
    addToast,
    sendCalls,
    chainId,
    getCallsStatus,
    handleClose,
    shouldWaitWithdraw
  ])

  function formatDuration(ms: number) {
    const totalMinutes = Math.floor(ms / 60000)
    const days = Math.floor(totalMinutes / 1440)
    const hours = Math.floor((totalMinutes % 1440) / 60)
    const minutes = totalMinutes % 60
    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}`
  }

  const buttonText = useMemo(() => {
    if (!isConnected) return 'Connect a new account'
    if (isLoadingLogs || isLoadingOnchainData) return 'Loading...'
    if (isSigning) return 'Signing...'
    if (activeTab === 'stake') return onchainData?.walletBalance ? 'Stake' : 'Buy $WALLET'
    if (!toWithdraw) return 'Unstake'
    if (!firstToCollect) return "We couldn't get withdraw info"
    const { unlocksAt } = firstToCollect
    const time = new Date(Number(unlocksAt * 1000n))
    if (time < new Date()) return 'Withdraw'
    return `Withdraw in ${formatDuration(time.getTime() - new Date().getTime())}`
  }, [
    isConnected,
    isLoadingLogs,
    isLoadingOnchainData,
    isSigning,
    activeTab,
    toWithdraw,
    firstToCollect,
    onchainData
  ])

  const meaningfulToken = useMemo(() => {
    return activeTab === 'stake'
      ? { balance: onchainData?.walletBalance || 0n, symbol: 'WALLET' }
      : { balance: onchainData?.stkWalletBalance || 0n, symbol: 'stkWALLET' }
  }, [onchainData, activeTab])

  const inputValidationError = useMemo(() => {
    if (meaningfulToken.balance < parseEther(inputAmount || '0')) return 'Insufficient balance'
    return ''
  }, [meaningfulToken, inputAmount])

  const isButtonDisabled = useMemo(() => {
    if (
      !isConnected ||
      isLoadingLogs ||
      isLoadingOnchainData ||
      isSigning ||
      !onchainData ||
      inputValidationError
    )
      return true
    if (activeTab === 'stake') {
      if (!onchainData?.walletBalance) return false
      return !inputAmount
    }

    if (!onchainData.lockedShares) return !onchainData.stkWalletBalance
    return !!shouldWaitWithdraw
  }, [
    isConnected,
    isLoadingLogs,
    isLoadingOnchainData,
    isSigning,
    onchainData,
    inputAmount,
    inputValidationError,
    activeTab,
    shouldWaitWithdraw
  ])

  const setPercentage = useCallback(
    (percentage: number) => {
      const inWei = (meaningfulToken.balance * BigInt(percentage)) / 100n
      const toSet = formatUnits(inWei, 18)
      setInputAmount(toSet)

      // const currentBalance = parseFloat(formatUnits(meaningfulToken.balance, 18))
      // if (percentage === 100) setInputAmount(currentBalance.toString())
      // setInputAmount(((currentBalance / 100) * percentage).toString())
    },
    [meaningfulToken]
  )

  if (!isOpen) return null

  return createPortal(
    <div className={styles.backdrop}>
      <div className={styles.wrapper}>
        <button type="button" className={styles.closeButton} onClick={handleCloseClick}>
          <CloseIcon />
        </button>
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>Stake $WALLET</h2>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'stake' ? styles.activeTab : ''}`}
              onClick={() => {
                setInputAmount('')
                setActiveTab('stake')
              }}
            >
              Stake
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'unstake' ? styles.activeTab : ''}`}
              onClick={() => {
                setInputAmount('')
                setActiveTab('unstake')
              }}
              data-tooltip-id="unstake"
            >
              Unstake
            </button>
          </div>
          <div className={`${styles.infoWrapper}`}>
            {!!onchainData?.lockedShares &&
              activeTab === 'unstake' &&
              (shouldWaitWithdraw ? (
                <LottieView
                  animationData={loadingAnimation}
                  style={{
                    width: '5rem',
                    height: '5rem',
                    position: 'absolute',
                    alignSelf: 'center',
                    marginTop: '20%'
                  }}
                  loop
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    fontSize: '1.5rem',
                    alignSelf: 'center',
                    marginTop: '25%',
                    fontWeight: 'bold'
                  }}
                >
                  Ready to withdraw{' '}
                  {firstToCollect?.maxTokens ? formatToken(firstToCollect.maxTokens).token : ''}{' '}
                  $WALLET
                </div>
              ))}
            <div className={`${styles.infoRow} ${styles.aprInfo}`}>
              APY
              <button type="button" onClick={goToAPYArticle}>
                <InfoIcon
                  width={12}
                  height={12}
                  color="currentColor"
                  className={styles.infoIcon}
                  data-tooltip-id="weight-info"
                />
              </button>
              {walletTokenInfo?.apy.toFixed(2)}%
            </div>
            <div className={`${toWithdraw && styles.blur}`}>
              <div className={styles.infoRow}>
                <div className={styles.actionLabel}>
                  {activeTab === 'stake' ? 'Stake' : 'Unstake'}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.label}>
                  ${(Number(inputAmount || '0') * (walletTokenInfo?.walletPrice || 0)).toFixed(2)}
                </div>

                <div className={styles.label}>
                  Balance: {formatToken(meaningfulToken.balance).token}
                </div>
              </div>
              <div className={`${styles.stakeInputRow} `}>
                <div>
                  <Input.Field
                    type="number"
                    value={parseFloat(inputAmount) ? parseFloat(inputAmount).toFixed(5) : ''}
                    disabled={isLoadingLogs || isLoadingOnchainData || isSigning}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className={styles.stakeInput}
                    placeholder="0.00"
                    style={{ textAlign: 'left' }}
                  />
                  <div
                    style={{
                      maxHeight: 0,
                      position: 'relative',
                      right: activeTab === 'stake' ? '-16em' : '-15rem',
                      top: '-2.4rem'
                    }}
                  >
                    ${meaningfulToken.symbol}
                  </div>
                </div>
                <div className={styles.stakeInputErrorWrapper}>
                  <Input.ValidationAndInfo
                    validation={{ message: inputValidationError, isError: true }}
                  />
                </div>
              </div>

              <div className={styles.stakeButtons}>
                {[25, 50, 75, 100].map((n) => (
                  <button
                    onClick={() => setPercentage(n)}
                    className={styles.percentageButton}
                    type="button"
                    key={n}
                  >
                    {n}%
                  </button>
                ))}
              </div>
            </div>
          </div>
          {activeTab === 'unstake' && (
            <div className={styles.lockPeriodInfo}>
              {toWithdraw
                ? 'You will be able to withdraw and unstake more as soon as the locking period has ended.'
                : 'The selected amount will have a 1 month locking period.'}
            </div>
          )}
          <button
            type="button"
            className={styles.stakeButton}
            onClick={handleAction}
            disabled={isButtonDisabled}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  )
}

export default StakeWalletModal
