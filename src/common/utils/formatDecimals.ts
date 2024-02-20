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

// A function that formats a number to a string with a specific number of decimals
// and a dollar sign prefix if the type is 'value'
const formatDecimals = (value?: number, type?: 'value' | 'amount' | 'price') => {
  let withDollarPrefix = TYPES_WITH_DOLLAR_PREFIX.includes(type || '')

  if (value === 0) return `${getPrefix(withDollarPrefix)}0.00`
  if (!value || isNaN(value)) return `${getPrefix(withDollarPrefix)}-`

  const indexOfFirstNonZero = getIndexOfFirstNonZeroInDecimals(value)

  let decimals = value >= 1 ? DEFAULT_DECIMALS : indexOfFirstNonZero + DEFAULT_DECIMALS

  if ((type === 'value' && value > 10) || (type === 'amount' && value > 100)) {
    decimals = 0
  }

  if (type === 'value' && value < 0.01 && value > 0) {
    withDollarPrefix = false
    return '<$0.01'
  }

  if (type === 'amount' && value < 0.00001 && value > 0) {
    return '<0.00001'
  }

  return `${getPrefix(withDollarPrefix)}${value.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  })}`
}

export default formatDecimals
