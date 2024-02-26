import { ColorValue, ViewStyle } from 'react-native'

import useMultiHover from './useMultiHover'

interface Props {
  property: keyof ViewStyle
  values: {
    from: number | ColorValue
    to: number | ColorValue
  }
  duration?: number
}

const useCustomHover = ({ property, values, duration }: Props) => {
  const value = useMultiHover({
    values: [{ key: property, ...values }],
    duration
  })

  return value
}

export default useCustomHover
