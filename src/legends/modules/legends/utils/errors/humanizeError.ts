import { decodeError } from '@ambire-common/libs/errorDecoder'
import { TRANSACTION_REJECTED_REASON } from '@ambire-common/libs/errorDecoder/handlers/userRejection'
import { getErrorCodeStringFromReason } from '@ambire-common/libs/errorDecoder/helpers'
import HumanReadableError from '@legends/classes/HumanReadableError'
import { ERROR_MESSAGES } from '@legends/constants/errors/messages'

const HUMANIZED_ERRORS = [
  {
    message: ERROR_MESSAGES.transactionRejected,
    reasons: [TRANSACTION_REJECTED_REASON]
  }
]

const humanizeError = (error: any, fallbackMessage: string): string => {
  // Already humanized
  if (error instanceof HumanReadableError) {
    return error.message
  }

  const { reason } = decodeError(error)

  const checkAgainst = reason || error?.error?.message || error?.message
  let message = null

  if (checkAgainst) {
    HUMANIZED_ERRORS.forEach(({ reasons }) => {
      const isMatching = reasons.some((errorReason) =>
        checkAgainst.toLowerCase().includes(errorReason.toLowerCase())
      )
      if (!isMatching) return

      message = error.message
    })
  }

  if (!message) {
    const reasonString = getErrorCodeStringFromReason(reason ?? '')

    return `${fallbackMessage}${reasonString}`
  }

  return message
}

export { humanizeError }
