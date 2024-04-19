import { CSSProperties } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { MenuPlacement, OptionProps, Props as SelectProps } from 'react-select'

export type OptionType = OptionProps['data']

export interface Props extends SelectProps {
  value: {} // @TODO: react-native works with object here, we need to find its type
  defaultValue?: {} // @TODO: react-native works with object here, we need to find its type
  options: any[]
  setValue?: (value: any) => void
  placeholder?: string
  label?: string
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
