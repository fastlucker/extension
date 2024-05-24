import { isAddress } from 'ethers'

import { FEE_COLLECTOR } from '@ambire-common/consts/addresses'
import { Contacts } from '@ambire-common/controllers/addressBook/addressBook'
import { TransferController } from '@ambire-common/controllers/transfer/transfer'
import { AccountId } from '@ambire-common/interfaces/account'
import { AddressState } from '@ambire-common/interfaces/domains'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { TokenResult } from '@ambire-common/libs/portfolio'
import {
  validateSendTransferAddress,
  validateSendTransferAmount
} from '@ambire-common/services/validations'

const DEFAULT_VALIDATION_FORM_MSGS = {
  amount: {
    success: false,
    message: ''
  },
  recipientAddress: {
    success: false,
    message: ''
  }
}

const getRecipientValidation = ({
  addressState,
  selectedToken,
  networks,
  contacts,
  isTopUp,
  humanizerInfo
}: {
  addressState: AddressState
  selectedToken: TokenResult | null
  networks: NetworkDescriptor[]
  contacts: Contacts
  isTopUp: boolean
  humanizerInfo: any
}) => {
  const recipientAddress =
    addressState.ensAddress || addressState.udAddress || addressState.fieldValue

  const isAddressInAddressBook = contacts.some(
    ({ address }) => address.toLowerCase() === recipientAddress.toLowerCase()
  )

  const isRecipientAddressUnknown =
    isAddress(recipientAddress) &&
    !isAddressInAddressBook &&
    recipientAddress.toLowerCase() !== FEE_COLLECTOR.toLowerCase()

  const isSWWarningVisible =
    isRecipientAddressUnknown &&
    !isTopUp &&
    !!selectedToken?.address &&
    Number(selectedToken?.address) === 0 &&
    networks
      .filter((n) => n.id !== 'ethereum')
      .map(({ id }) => id)
      .includes(selectedToken?.networkId || 'ethereum')

  const isRecipientHumanizerKnownTokenOrSmartContract =
    !!humanizerInfo.knownAddresses[recipientAddress.toLowerCase()]?.isSC

  return {
    isRecipientAddressUnknown,
    isSWWarningVisible,
    isRecipientHumanizerKnownTokenOrSmartContract
  }
}

const getSendFormValidation = ({
  addressState,
  selectedAccount,
  selectedToken,
  amount,
  networks,
  contacts,
  isTopUp,
  humanizerInfo,
  isRecipientAddressUnknownAgreed,
  isSWWarningAgreed
}: {
  addressState: AddressState
  selectedAccount: AccountId | null
  selectedToken: TransferController['selectedToken']
  amount: TransferController['amount']
  isRecipientAddressUnknownAgreed: TransferController['isRecipientAddressUnknownAgreed']
  isSWWarningAgreed: TransferController['isSWWarningAgreed']
  networks: NetworkDescriptor[]
  contacts: Contacts
  isTopUp: boolean
  humanizerInfo: any
}) => {
  const {
    isRecipientAddressUnknown,
    isRecipientHumanizerKnownTokenOrSmartContract,
    isSWWarningVisible
  } = getRecipientValidation({
    addressState,
    selectedToken,
    networks,
    contacts,
    isTopUp,
    humanizerInfo
  })

  const recipientAddress =
    addressState.ensAddress || addressState.udAddress || addressState.fieldValue
  const validationFormMsgsNew = DEFAULT_VALIDATION_FORM_MSGS

  const isUDAddress = !!addressState.udAddress
  const isEnsAddress = !!addressState.ensAddress

  // Should never happen
  if (!selectedAccount)
    return {
      validationFormMsgs: {
        amount: {
          success: false,
          message: ''
        },
        recipientAddress: {
          success: false,
          message: ''
        }
      },
      isRecipientAddressUnknown,
      isRecipientHumanizerKnownTokenOrSmartContract,
      isSWWarningVisible
    }

  validationFormMsgsNew.recipientAddress = validateSendTransferAddress(
    recipientAddress,
    selectedAccount,
    isRecipientAddressUnknownAgreed,
    isRecipientAddressUnknown,
    isRecipientHumanizerKnownTokenOrSmartContract,
    isUDAddress,
    isEnsAddress,
    addressState.isDomainResolving,
    isSWWarningVisible,
    isSWWarningAgreed
  )

  // Validate the amount
  if (selectedToken) {
    validationFormMsgsNew.amount = validateSendTransferAmount(amount, selectedToken)
  }

  return {
    validationFormMsgs: validationFormMsgsNew,
    isRecipientAddressUnknown,
    isRecipientHumanizerKnownTokenOrSmartContract,
    isSWWarningVisible
  }
}

const getIsFormDisabled = ({
  userRequest,
  isTopUp,
  isAddressValid,
  isAmountValid,
  isSmartAccount
}: {
  userRequest: TransferController['userRequest']
  isTopUp: boolean
  isAddressValid: boolean
  isAmountValid: boolean
  isSmartAccount: boolean
}) => {
  if (userRequest) return false

  if (isTopUp) return !isSmartAccount || !isAmountValid

  return !isAddressValid || !isAmountValid
}

export { getIsFormDisabled }

export default getSendFormValidation
