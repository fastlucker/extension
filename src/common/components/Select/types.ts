import { CSSProperties, ReactNode } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { MenuPlacement, OptionProps } from 'react-select'

export type OptionType = OptionProps['data']

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
  menuPlacement?: MenuPlacement
  style?: ViewStyle
  menuStyle?: ViewStyle
  controlStyle?: CSSProperties
  openMenuOnClick?: boolean
  onDropdownOpen?: () => void
  withSearch?: boolean
}
