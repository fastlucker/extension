import { ReactNode } from 'react'
import { TextStyle, ViewStyle } from 'react-native'

export type SelectValue = {
  value: string | number
  label: string | ReactNode
  icon?: string | ReactNode
  [key: string]: any
}
export type SelectProps = {
  value: SelectValue
  setValue?: (value: SelectValue) => void
  options: SelectValue[]
  defaultValue?: {}
  placeholder?: string
  label?: string
  containerStyle?: ViewStyle
  selectStyle?: ViewStyle
  labelStyle?: TextStyle
  disabled?: boolean
  menuStyle?: ViewStyle
  withSearch?: boolean
}
