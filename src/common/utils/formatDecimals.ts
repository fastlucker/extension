const getIndexOfFirstNonZeroInDecimals = (value: number) => {
  // Fixes scientific notation when converting to string
  const decimalValue = value.toFixed(value < 1 ? 16 : 2)
  const valueString = decimalValue.toString()
  const indexOfDot = valueString.indexOf('.')
  const decimals = valueString.slice(indexOfDot + 1)
  const indexOfFirstNonZero = decimals.split('').findIndex((char) => char !== '0')
  return indexOfFirstNonZero === -1 ? decimals.length : indexOfFirstNonZero
}

const getPrefix = (widthDollarPrefix: boolean) => (widthDollarPrefix ? '$' : '')

const DEFAULT_DECIMALS = 2
const TYPES_WITH_DOLLAR_PREFIX = ['value', 'price']

// A function that formats a number to a string with a specific number of decimals.
// Based on the passed type it will add a dollar sign prefix.
const formatDecimals = (value?: number, type?: 'value' | 'amount' | 'price') => {
  let withDollarPrefix = TYPES_WITH_DOLLAR_PREFIX.includes(type || '')

  if (value === 0) return `${getPrefix(withDollarPrefix)}0.00`
  if (!value || Number.isNaN(value)) return `${getPrefix(withDollarPrefix)}-`

  // The absolute value is used to determine the number of decimals and
  // then the actual value is formatted with the determined number of decimals.
  const absoluteValue = Math.abs(value)
  const indexOfFirstNonZero = getIndexOfFirstNonZeroInDecimals(value)

  let decimals = absoluteValue >= 1 ? DEFAULT_DECIMALS : indexOfFirstNonZero + DEFAULT_DECIMALS

  if ((type === 'value' && absoluteValue > 10) || (type === 'amount' && absoluteValue > 100)) {
    decimals = 0
  }

  if (type === 'value' && absoluteValue < 0.01 && absoluteValue > 0) {
    withDollarPrefix = false
    return '<$0.01'
  }

  if (type === 'amount' && absoluteValue < 0.00001 && absoluteValue > 0) {
    return '<0.00001'
  }

  return `${getPrefix(withDollarPrefix)}${value.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  })}`
}

export default formatDecimals
