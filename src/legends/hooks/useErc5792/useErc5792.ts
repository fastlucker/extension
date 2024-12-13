import { delayPromise } from '@common/utils/promises'
import { RELAYER_URL } from '@env'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'

const ENTRY_POINT_BEFORE_EXECUTION_LOG_TOPIC =
  '0xbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972'

export const ERRORS = {
  txFailed: 'tx-failed',
  not4337: 'not-4337'
}

type Receipt = {
  blockHash: string
  blockNumber: string
  chainId: string
  gasUsed: string
  logs: {
    address: string
    data: string
    blockHash: string
    blockNumber: string
    logIndex: string
    transactionHash: string
    transactionIndex: string
    topics: string[]
  }[]
  status: string
  transactionHash: string
}

const useErc5792 = () => {
  // all fields below marked as string should be HEX!
  const sendCalls = async (
    chainId: string,
    accAddr: string,
    calls: { to: string; data: string; value?: string }[],
    useSponsorship = false
  ) => {
    const sendCallsIdentifier: any = await window.ambire.request({
      method: 'wallet_sendCalls',
      params: [
        {
          version: '1.0',
          chainId,
          from: accAddr,
          calls,
          capabilities: useSponsorship
            ? {
                paymasterService: {
                  [chainId]: {
                    url: `${RELAYER_URL}/v2/sponsorship`
                  }
                }
              }
            : undefined
        }
      ]
    })

    return sendCallsIdentifier as string
  }

  // the callsId should be an identifier return by the wallet
  // from wallet_sendCalls
  const getCallsStatus = async (
    callsId: string,
    is4337Required: boolean = true
  ): Promise<Receipt> => {
    let receipt = null
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const callStatus: any = await window.ambire.request({
        method: 'wallet_getCallsStatus',
        params: [callsId]
      })

      if (callStatus.status === 'CONFIRMED') {
        receipt = callStatus.receipts[0]
        break
      }
      if (callStatus.status === 'REJECTED') {
        throw new Error('Error, try again')
      }

      // eslint-disable-next-line no-await-in-loop
      await delayPromise(1500)
    }

    if (Number(receipt.status) === 0)
      throw new Error(
        'The transaction failed and will not grant any XP. Please try signing again.',
        {
          cause: ERRORS.txFailed
        }
      )

    const { logs } = receipt

    const is4337 = logs.some((log: any) => log.topics[0] === ENTRY_POINT_BEFORE_EXECUTION_LOG_TOPIC)

    if (!is4337 && is4337Required)
      throw new Error(ERROR_MESSAGES.transactionCostsCoveredWithEOA, {
        cause: ERRORS.not4337
      })

    return receipt
  }

  return {
    getCallsStatus,
    sendCalls,
    // the correct format for chainId when using erc5792
    chainId: '0x2105'
  }
}

export default useErc5792
