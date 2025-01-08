import { ReactNode } from 'react'
import { SectionListProps, TextStyle, ViewStyle } from 'react-native'

export type SelectValue = {
  value: string | number
  label: string | ReactNode
  icon?: string | ReactNode
  disabled?: boolean
  [key: string]: any
}

export type CommonSelectProps = {
  value: SelectValue
  setValue?: (value: SelectValue) => void
  handleSearch?: (search: string) => void
  defaultValue?: {}
  placeholder?: string
  label?: string
  size?: 'sm' | 'md'
  containerStyle?: ViewStyle
  selectStyle?: ViewStyle
  labelStyle?: TextStyle
  disabled?: boolean
  menuOptionHeight?: number
  menuStyle?: ViewStyle
  withSearch?: boolean
  searchPlaceholder?: string
  testID?: string
  extraSearchProps?: { [key: string]: string }
}
export type SelectProps = CommonSelectProps & {
  options: SelectValue[]
  attemptToFetchMoreOptions?: (search: string) => void
  emptyListPlaceholderText?: string
}

export type SectionedSelectProps = CommonSelectProps &
  Pick<
    SectionListProps<SelectValue>,
    'sections' | 'renderSectionHeader' | 'SectionSeparatorComponent' | 'stickySectionHeadersEnabled'
  >
