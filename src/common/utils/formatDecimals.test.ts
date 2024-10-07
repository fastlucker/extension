import formatDecimals from './formatDecimals'

const TEST_CASES: {
  value: number | undefined
  type: 'value' | 'price' | 'amount' | 'default' | 'precise'
  expected: string
}[] = [
  { value: 1234.5678, type: 'value', expected: '$1,234.56' },
  { value: 1234.5678, type: 'price', expected: '$1,234.56' },
  { value: 1234.5678, type: 'amount', expected: '1,234.56' },
  { value: 1234.5678, type: 'default', expected: '1,234.56' },
  { value: 1234.5678901234, type: 'precise', expected: '1,234.56789012' },
  { value: 1234, type: 'value', expected: '$1,234.00' },
  { value: 1234, type: 'price', expected: '$1,234.00' },
  { value: 1234, type: 'amount', expected: '1,234' },
  { value: 1234, type: 'default', expected: '1,234' },
  { value: 1234, type: 'precise', expected: '1,234' },
  { value: -1234.5678, type: 'value', expected: '-$1,234.56' },
  { value: -1234.5678, type: 'price', expected: '-$1,234.56' },
  { value: -1234.5678, type: 'amount', expected: '-1,234.56' },
  { value: -1234.5678, type: 'default', expected: '-1,234.56' },
  { value: -1234.5678901234, type: 'precise', expected: '-1,234.56789012' },
  { value: -1234, type: 'value', expected: '-$1,234.00' },
  { value: -1234, type: 'price', expected: '-$1,234.00' },
  { value: -1234, type: 'amount', expected: '-1,234' },
  { value: -1234, type: 'default', expected: '-1,234' },
  { value: -1234, type: 'precise', expected: '-1,234' },
  { value: 0, type: 'value', expected: '$0.00' },
  { value: 0, type: 'price', expected: '$0.00' },
  { value: 0, type: 'amount', expected: '0' },
  { value: 0, type: 'default', expected: '0.00' },
  { value: 0, type: 'precise', expected: '0.00' },
  { value: undefined, type: 'value', expected: '$-' },
  { value: undefined, type: 'price', expected: '$-' },
  { value: undefined, type: 'amount', expected: '-' },
  { value: undefined, type: 'default', expected: '-' },
  { value: undefined, type: 'precise', expected: '-' },
  { value: NaN, type: 'value', expected: '$-' },
  { value: NaN, type: 'price', expected: '$-' },
  { value: NaN, type: 'amount', expected: '-' },
  { value: NaN, type: 'default', expected: '-' },
  { value: NaN, type: 'precise', expected: '-' }
]

describe('formatDecimals', () => {
  TEST_CASES.forEach(({ value, type, expected }) => {
    it(`should format ${value} as ${expected} for type ${type}`, () => {
      expect(formatDecimals(value, type)).toBe(expected)
    })
  })
})
