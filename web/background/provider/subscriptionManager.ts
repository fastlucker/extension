import { PollingBlockTracker } from 'eth-block-tracker'
// @ts-ignore
import createSubscriptionManager from 'eth-json-rpc-filters/subscriptionManager'

import buildinProvider from '@web/background/provider/buildinProvider'

const createSubscription = async (): Promise<any> => {
  const blockTracker = new PollingBlockTracker({
    provider: buildinProvider.currentProvider,
    keepEventLoopActive: false,
    setSkipCacheFlag: true,
    pollingInterval: 5 * 1000 // 5 sec.
  })
  const { events, middleware } = createSubscriptionManager({
    provider: buildinProvider.currentProvider,
    blockTracker
  })
  const { destroy } = middleware
  const func = async (req: any) => {
    const { data } = req || {}
    const res: Record<string, any> = {}
    await middleware(
      data,
      res,
      () => null,
      () => {}
    )
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
