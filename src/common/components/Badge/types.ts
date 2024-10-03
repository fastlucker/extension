import { ViewStyle } from 'react-native'

type BadgeType = 'info' | 'warning' | 'default' | 'success'

type Props = {
  text: string
  type?: BadgeType
  tooltipText?: string
  style?: ViewStyle
  withRightSpacing?: boolean
  nativeID?: string
  children?: any
}

export type { BadgeType, Props }
