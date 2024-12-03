import { delayPromise } from '@common/utils/promises'
import { RELAYER_URL } from '@env'

import useToast from '../useToast'

const useErc5792 = () => {
  const { addToast } = useToast()

  // all fields below marked as string should be HEX!
  const sendCalls = async (
    chainId: string,
    accAddr: string,
    calls: { to: string; data: string; value?: string }[]
  ) => {
    const sendCallsIdentifier: any = await window.ambire.request({
      method: 'wallet_sendCalls',
      params: [
        {
          version: '1.0',
          chainId,
          from: accAddr,
          calls,
          capabilities: {
            paymasterService: {
              [chainId]: {
                url: `${RELAYER_URL}/v2/sponsorship`
              }
            }
          }
        }
      ]
    })

    return sendCallsIdentifier as string
  }

  // the callsId should be an identifier return by the wallet
  // from wallet_sendCalls
  const getCallsStatus = async (callsId: string) => {
    try {
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

      return receipt
    } catch {
      addToast('Failed to retrieve calls status', 'error')
    }
  }

  return {
    getCallsStatus,
    sendCalls
  }
}

export default useErc5792
