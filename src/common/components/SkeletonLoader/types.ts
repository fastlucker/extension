import { ViewStyle } from 'react-native'

interface Props {
  width: ViewStyle['width']
  height: ViewStyle['height']
  borderRadius?: number
  style?: ViewStyle
  lowOpacity?: boolean
}

export { type Props as SkeletonLoaderProps }
