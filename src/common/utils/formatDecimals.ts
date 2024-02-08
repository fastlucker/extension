export function formatThousands(input: string) {
  const parts = input.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const getIndexOfFirstNonZeroInDecimals = (value: number) => {
  if (value === 0) return 0
  // Fixes scientific notation when converting to string
  const decimalValue = value.toFixed(value < 1 ? 16 : 2)
  const valueString = decimalValue.toString()
  const indexOfDot = valueString.indexOf('.')
  const decimals = valueString.slice(indexOfDot + 1)
  const indexOfFirstNonZero = decimals.split('').findIndex((char) => char !== '0')
  return indexOfFirstNonZero === -1 ? decimals.length : indexOfFirstNonZero
}

const DEFAULT_DECIMALS = 2

const formatDecimals = (value: number, type?: 'value' | 'amount') => {
  const indexOfFirstNonZero = getIndexOfFirstNonZeroInDecimals(value)
  let decimals = value > 1 ? DEFAULT_DECIMALS : indexOfFirstNonZero + DEFAULT_DECIMALS

  if ((type === 'value' && value > 10) || (type === 'amount' && value > 100)) {
    decimals = 0
  }

  return formatThousands(value.toFixed(decimals))
}

export default formatDecimals
