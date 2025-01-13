import { ViewStyle } from 'react-native'

import { TextWeight } from '@common/components/Text'

type BadgeType = 'info' | 'warning' | 'default' | 'success' | 'error'

type Props = {
  text: string
  weight?: TextWeight
  type?: BadgeType
  tooltipText?: string
  style?: ViewStyle
  withRightSpacing?: boolean
  nativeID?: string
  children?: React.ReactNode
}

export type { BadgeType, Props }
