import { isKnownTokenOrContract, isValidAddress } from 'ambire-common/src/services/address'
import { parseUnits } from 'ethers/lib/utils'
import isEmail from 'validator/es/lib/isEmail'

const validateAddress = (address: string) => {
  if (!(address && address.length)) {
    return {
      success: false,
      message: ''
    }
  }

  if (!(address && isValidAddress(address))) {
    return {
      success: false,
      message: 'Invalid address.'
    }
  }

  return { success: true }
}

const validateSendTransferAddress = (
  address: string,
  selectedAcc: any,
  addressConfirmed: any,
  isKnownAddress: any
) => {
  const isValidAddr = validateAddress(address)
  if (!isValidAddr.success) return isValidAddr

  if (address && selectedAcc && address === selectedAcc) {
    return {
      success: false,
      message: 'The entered address should be different than the your own account address.'
    }
  }

  if (address && isKnownTokenOrContract(address)) {
    return {
      success: false,
      message: 'You are trying to send tokens to a smart contract. Doing so would burn them.'
    }
  }

  if (address && !isKnownAddress(address) && !addressConfirmed) {
    return {
      success: false,
      message:
        "You're trying to send to an unknown address. If you're really sure, confirm using the checkbox below."
    }
  }

  return { success: true }
}

const validateSendTransferAmount = (amount: any, selectedAsset: any) => {
  if (!(amount && amount.length)) {
    return {
      success: false,
      message: ''
    }
  }

  if (!(amount && amount > 0)) {
    return {
      success: false,
      message: 'The amount must be greater than 0.'
    }
  }

  try {
    if (amount && selectedAsset && selectedAsset.decimals) {
      const parsedAmount = amount.slice(0, amount.indexOf('.') + selectedAsset.decimals + 1) // Fixed decimals in case amount is bigger than selectedAsset.decimals, otherwise would cause overflow error
      const bigNumberAmount = parseUnits(parsedAmount, selectedAsset.decimals)
      if (
        bigNumberAmount &&
        selectedAsset.balanceRaw &&
        bigNumberAmount.gt(selectedAsset.balanceRaw)
      ) {
        return {
          success: false,
          message: `The amount is greater than the asset's balance: ${selectedAsset?.balance} ${selectedAsset?.symbol}.`
        }
      }
    }
  } catch (e) {
    console.error(e)
  }

  return { success: true }
}

const isValidCode = (code: string) => code.length === 6

const isValidPassword = (password: string) => password.length >= 8

export {
  isEmail,
  validateSendTransferAddress,
  validateSendTransferAmount,
  isValidCode,
  isValidPassword
}
