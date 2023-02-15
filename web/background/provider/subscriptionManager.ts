import { getProvider } from 'ambire-common/src/services/provider'
import { PollingBlockTracker } from 'eth-block-tracker'
// @ts-ignore
import createSubscriptionManager from 'eth-json-rpc-filters/subscriptionManager'

import storage from '@web/background/webapi/storage'

const createSubscription = async (buildinProvider: any): Promise<any> => {
  const networkId = await storage.get('networkId')
  // We need to use the rpc provider directly for the blockTracker because
  // the app crashes for unknown reason when we pass the buildinProvider to
  // the blockTracker
  // Usage: https://github.com/MetaMask/eth-block-tracker#usage
  const provider = getProvider(networkId)

  const blockTracker = new PollingBlockTracker({
    provider
  })
  const { events, middleware } = createSubscriptionManager({
    provider: buildinProvider,
    blockTracker
  })
  const { destroy } = middleware
  const func = async (req: any) => {
    const { data } = req || {}
    const res: Record<string, any> = {}
    let error = null
    await middleware(
      data,
      res,
      () => null,
      (e: any) => {
        error = e
      }
    )
    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error
    }
    return res.result
  }

  return {
    events,
    methods: {
      eth_subscribe: func,
      eth_unsubscribe: func
    },
    destroy
  }
}

export default createSubscription
