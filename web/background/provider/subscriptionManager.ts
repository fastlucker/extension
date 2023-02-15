import { getProvider } from 'ambire-common/src/services/provider'
import { PollingBlockTracker } from 'eth-block-tracker'
// @ts-ignore
import createSubscriptionManager from 'eth-json-rpc-filters/subscriptionManager'

import storage from '@web/background/webapi/storage'

const createSubscription = async (provider: any): Promise<any> => {
  const networkId = await storage.get('networkId')
  const p = getProvider(networkId)

  const blockTracker = new PollingBlockTracker({
    provider: p
  })
  const { events, middleware } = createSubscriptionManager({
    provider,
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
