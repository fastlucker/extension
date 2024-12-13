import { decodeError } from '@ambire-common/libs/errorDecoder'
import { TRANSACTION_REJECTED_REASON } from '@ambire-common/libs/errorDecoder/handlers/userRejection'
import { ERRORS } from '@legends/hooks/useErc5792/useErc5792'

const humanizeLegendsBroadcastError = (error: any): string | null => {
  const { reason } = decodeError(error)

  if (reason === TRANSACTION_REJECTED_REASON) {
    return 'Transaction was rejected by the user!'
  }

  if (error.cause === ERRORS.not4337) {
    return error.message
  }

  return null
}

export { humanizeLegendsBroadcastError }
