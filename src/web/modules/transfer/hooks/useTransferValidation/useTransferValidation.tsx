import { useEffect, useRef, useState } from 'react'

import { TokenResult } from '@ambire-common/libs/portfolio'
import {
  validateSendTransferAddress,
  validateSendTransferAmount
} from '@ambire-common/services/validations'
import useConstants from '@common/hooks/useConstants'
import useIsScreenFocused from '@common/hooks/useIsScreenFocused'
import useMainControllerState from '@web/hooks/useMainControllerState'

const DEFAULT_VALIDATION_FORM_MSGS = {
  success: {
    amount: false,
    address: false
  },
  messages: {
    amount: '',
    address: ''
  }
}

const useTransferValidation = ({
  amount,
  selectedToken,
  recipientAddress,
  recipientUDAddress,
  recipientEnsAddress,
  isRecipientAddressUnknown,
  isRecipientAddressUnknownAgreed,
  isSWWarningVisible,
  isSWWarningAgreed,
  isRecipientDomainResolving
}: {
  amount: string
  selectedToken: TokenResult | null
  recipientAddress: string
  recipientUDAddress: string
  recipientEnsAddress: string
  isRecipientAddressUnknown: boolean
  isRecipientAddressUnknownAgreed: boolean
  isSWWarningVisible: boolean
  isSWWarningAgreed: boolean
  isRecipientDomainResolving: boolean
}) => {
  const isFocused = useIsScreenFocused()

  const { selectedAccount } = useMainControllerState()
  const { constants } = useConstants()
  const [validationFormMsgs, setValidationFormMsgs] = useState<{
    success: {
      amount: boolean
      address: boolean
    }
    messages: {
      amount: string | null
      address: string | null
    }
  }>(DEFAULT_VALIDATION_FORM_MSGS)
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (isFocused && selectedAccount && selectedToken && recipientAddress) {
      const isValidSendTransferAmount = validateSendTransferAmount(amount, selectedToken)
      const isUDAddress = !!recipientUDAddress
      const isEnsAddress = !!recipientEnsAddress
      const isValidRecipientAddress = validateSendTransferAddress(
        recipientUDAddress || recipientEnsAddress || recipientAddress,
        selectedAccount,
        isRecipientAddressUnknownAgreed,
        isRecipientAddressUnknown,
        constants!.humanizerInfo,
        isUDAddress,
        isEnsAddress,
        isRecipientDomainResolving
      )

      setValidationFormMsgs({
        success: {
          amount: isValidSendTransferAmount.success,
          address: isValidRecipientAddress.success
        },
        messages: {
          amount: isValidSendTransferAmount.message ? isValidSendTransferAmount.message : '',
          address: isValidRecipientAddress.message ? isValidRecipientAddress.message : ''
        }
      })

      setDisabled(
        !isValidRecipientAddress.success ||
          !isValidSendTransferAmount.success ||
          (!isSWWarningAgreed && isSWWarningVisible) ||
          (!isRecipientAddressUnknownAgreed && isRecipientAddressUnknown)
      )
    }
  }, [
    recipientAddress,
    recipientEnsAddress,
    recipientUDAddress,
    selectedAccount,
    selectedToken,
    isRecipientAddressUnknown,
    isRecipientAddressUnknownAgreed,
    isFocused,
    amount,
    constants,
    isSWWarningVisible,
    isSWWarningAgreed
  ])

  return {
    validationFormMsgs,
    disabled
  }
}

export default useTransferValidation
