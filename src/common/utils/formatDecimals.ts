const DEFAULT_DECIMALS = 2
const DECIMAL_RULES = {
  value: {
    min: 2
  },
  price: {
    min: 2
  },
  amount: {
    min: 2
  }
}
const TYPES_WITH_DOLLAR_PREFIX = ['value', 'price']

/**
 * Removes trailing zeros from a decimal string.
 * @example
 * removeTrailingZeros('1.0500') // '1.05'
 */
const removeTrailingZeros = (decimalStr: string, minDecimals: number = 0) => {
  if (!decimalStr.includes('.')) return decimalStr // If there's no decimal point, return the original string

  let result = decimalStr

  // Loop from the end of the string until a non-zero character is found
  while (
    result.endsWith('0') &&
    (!minDecimals || result.length - 1 - result.indexOf('.') > minDecimals)
  ) {
    result = result.slice(0, -1) // Remove the last character
  }

  // If the string ends with a decimal point after removing zeros, remove it
  if (result.endsWith('.')) {
    result = result.slice(0, -1)
  }

  return result
}

const getIndexOfFirstNonZeroInDecimals = (value: number) => {
  // Fixes scientific notation when converting to string
  const decimalValue = value.toFixed(value < 1 ? 16 : 2)
  const valueString = decimalValue.toString()
  const indexOfDot = valueString.indexOf('.')
  if (indexOfDot === -1) return 0
  const decimals = valueString.slice(indexOfDot + 1)
  const indexOfFirstNonZero = decimals.split('').findIndex((char) => char !== '0')

  return indexOfFirstNonZero === -1 ? decimals.length : indexOfFirstNonZero
}

const getPrefix = (widthDollarPrefix: boolean) => (widthDollarPrefix ? '$' : '')

const formatNumber = (
  value: number,
  withDollarPrefix: boolean,
  decimals: number,
  type?: 'value' | 'amount' | 'price'
) => {
  const stringValue = value.toFixed(16)
  const [integer, decimal] = stringValue.split('.')
  // Display the number with the determined number of decimals
  const decimalFormatted = decimal.slice(0, decimals)
  const reconstructedStringValue = `${integer}.${decimalFormatted}`
  const stringValueWithoutTrailingZeros = removeTrailingZeros(
    reconstructedStringValue,
    type ? DECIMAL_RULES[type].min : undefined
  )

  return `${getPrefix(withDollarPrefix)}${stringValueWithoutTrailingZeros}`
}

// A function that formats a number to a string with a specific number of decimals.
// Based on the passed type it will add a dollar sign prefix.
const formatDecimals = (value?: number, type?: 'value' | 'amount' | 'price') => {
  const withDollarPrefix = TYPES_WITH_DOLLAR_PREFIX.includes(type || '')

  if (value === 0) {
    if (type === 'amount') return `${getPrefix(withDollarPrefix)}0`

    return `${getPrefix(withDollarPrefix)}0.00`
  }
  if (!value || Number.isNaN(value)) return `${getPrefix(withDollarPrefix)}-`

  // The absolute value is used to determine the number of decimals and
  // then the actual value is formatted with the determined number of decimals.
  const absoluteValue = Math.abs(value)

  if (type === 'value') {
    if (absoluteValue < 0.01) {
      return '<$0.01'
    }
    if (absoluteValue >= 0.01 && absoluteValue < 1) {
      return formatNumber(value, withDollarPrefix, DEFAULT_DECIMALS, type)
    }
    if (absoluteValue > 10) {
      return formatNumber(value, withDollarPrefix, 0, type)
    }
  }

  if (type === 'amount') {
    if (absoluteValue < 0.00001) {
      return '<0.00001'
    }

    if (absoluteValue > 100) {
      return formatNumber(value, withDollarPrefix, 0, type)
    }
  }

  const indexOfFirstNonZero = getIndexOfFirstNonZeroInDecimals(value)
  // Find the first non-zero character in the decimals and display one more decimal than that
  const decimals = absoluteValue >= 1 ? DEFAULT_DECIMALS : indexOfFirstNonZero + DEFAULT_DECIMALS

  return formatNumber(value, withDollarPrefix, decimals, type)
}

export default formatDecimals
