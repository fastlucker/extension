export const buildFeeTokenSelector = (accAddress, feeTokenAddress, gasTank = false) =>
  `[data-testid="option-${accAddress.toLowerCase()}${feeTokenAddress}${gasTank ? 'gastank' : ''}"]`
