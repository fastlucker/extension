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
  isSWWarningAgreed
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
  const timer = useRef<any>(null)

  useEffect(() => {
    if (isFocused && selectedAccount && selectedToken && recipientAddress) {
      const isValidSendTransferAmount = validateSendTransferAmount(amount, selectedToken)

      if (!recipientEnsAddress && !recipientUDAddress) {
        const isValidRecipientAddress = validateSendTransferAddress(
          recipientAddress,
          selectedAccount,
          isRecipientAddressUnknownAgreed,
          isRecipientAddressUnknown,
          constants!.humanizerInfo
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
            (isSWWarningAgreed && isSWWarningVisible) ||
            (!isRecipientAddressUnknownAgreed && isRecipientAddressUnknown)
        )
        return
      }

      if (timer.current) {
        clearTimeout(timer.current)
      }

      const validateForm = async () => {
        timer.current = null
        const isUDAddress = !!recipientUDAddress
        const isEnsAddress = !!recipientEnsAddress
        const isValidRecipientAddress = validateSendTransferAddress(
          recipientUDAddress || recipientEnsAddress || recipientAddress,
          selectedAccount,
          isRecipientAddressUnknownAgreed,
          isRecipientAddressUnknown,
          constants!.humanizerInfo,
          isUDAddress,
          isEnsAddress
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

      timer.current = setTimeout(async () => {
        return validateForm().catch(console.error)
      }, 300)
    }
    return () => clearTimeout(timer?.current)
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
