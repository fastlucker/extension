import { ReactNode } from 'react'
import { TextProps } from 'react-native'

export type ToggleProps = {
  id?: string
  isOn: boolean
  onToggle: (isOn: boolean) => any
  label?: string
  style?: any
  disabled?: boolean
  testID?: string
  labelProps?: TextProps
  toggleStyle?: React.CSSProperties
  trackStyle?: React.CSSProperties
  children?: ReactNode
}
