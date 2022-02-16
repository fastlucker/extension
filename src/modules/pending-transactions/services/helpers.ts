// It costs around 19k to send a token, if that token was interacted with before in the same transaction,
// because of SLOAD costs - they depend on whether a slot has been read
// however, it costs 30k if the token has not been interacted with

import i18n from '@config/localization/localization'

// we may decrease it a bit and lean on the relayer failsafe values (cfg.gasAddedOnEstimate) later on
const ADDED_GAS_TOKEN = 30000
const ADDED_GAS_NATIVE = 12000

export function isTokenEligible(token: any, speed: any, estimation: any) {
  if (!token) return false
  const min = token.isStable ? estimation.feeInUSD[speed] : estimation.feeInNative[speed]
  return parseInt(token.balance) / 10 ** token.decimals > min
}

// can't think of a less funny name for that
export function getFeePaymentConsequences(token: any, estimation: any) {
  // Relayerless mode
  if (!estimation.feeInUSD) return { multiplier: 1, addedGas: 0 }
  // Relayer mode
  const addedGas =
    !token.address || token.address === '0x0000000000000000000000000000000000000000'
      ? ADDED_GAS_NATIVE
      : ADDED_GAS_TOKEN
  return {
    // otherwise we get very long floating point numbers with trailing .999999
    multiplier: parseFloat(((estimation.gasLimit + addedGas) / estimation.gasLimit).toFixed(4)),
    addedGas
  }
}

export function mapTxnErrMsg(msg: string) {
  if (!msg) return
  if (msg.includes('Router: EXPIRED')) return i18n.t('Swap expired')
  if (msg.includes('Router: INSUFFICIENT_OUTPUT_AMOUNT'))
    return i18n.t('Swap will suffer slippage higher than your requirements')
  if (msg.includes('INSUFFICIENT_PRIVILEGE'))
    return i18n.t('Your signer address is not authorized.')
  return msg
}

export function getErrHint(msg: string) {
  if (!msg) return
  if (msg.includes('Router: EXPIRED')) return i18n.t('Try performing the swap again')
  if (msg.includes('Router: INSUFFICIENT_OUTPUT_AMOUNT'))
    return i18n.t('Try performing the swap again or increase your slippage requirements')
  if (msg.includes('INSUFFICIENT_PRIVILEGE'))
    return i18n.t('If you set a new signer for this account, try re-adding the account.')
  return i18n.t('Sending this transaction batch will result in an error.')
}
