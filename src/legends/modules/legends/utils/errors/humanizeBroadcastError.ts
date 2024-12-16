import { decodeError } from '@ambire-common/libs/errorDecoder'
import { TRANSACTION_REJECTED_REASON } from '@ambire-common/libs/errorDecoder/handlers/userRejection'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'
import { ERRORS } from '@legends/hooks/useErc5792/useErc5792'

const humanizeLegendsBroadcastError = (error: any): string | null => {
  const { reason } = decodeError(error)

  if (reason === TRANSACTION_REJECTED_REASON) {
    return ERROR_MESSAGES.transactionRejected
  }

  if (error.cause === ERRORS.not4337) {
    return error.message
  }

  return null
}

export { humanizeLegendsBroadcastError }
