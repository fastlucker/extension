import { PollingBlockTracker } from 'eth-block-tracker'
// @ts-ignore
import createSubscriptionManager from 'eth-json-rpc-filters/subscriptionManager'

const createSubscription = (provider: any) => {
  const blockTracker = new PollingBlockTracker({
    provider
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
