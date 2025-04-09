import { ReactNode } from 'react'
import { SectionListProps, TextStyle, ViewStyle } from 'react-native'

export type SelectValue = {
  value: string | number
  label: string | ReactNode
  icon?: string | ReactNode
  disabled?: boolean
  [key: string]: any
}

export type RenderSelectedOptionParams = {
  toggleMenu: () => void
  isMenuOpen: boolean
  selectRef: any
}

export type CommonSelectProps = {
  value?: SelectValue | null
  setValue?: (value: SelectValue) => void
  handleSearch?: (search: string) => void
  defaultValue?: {}
  placeholder?: string
  label?: string | ReactNode
  size?: 'sm' | 'md'
  containerStyle?: ViewStyle
  selectStyle?: ViewStyle
  labelStyle?: TextStyle
  emptyListPlaceholderText?: string
  disabled?: boolean
  menuOptionHeight?: number
  menuStyle?: ViewStyle
  menuLeftHorizontalOffset?: number
  withSearch?: boolean
  searchPlaceholder?: string
  testID?: string
  extraSearchProps?: { [key: string]: string }
  attemptToFetchMoreOptions?: (search: string) => void
  renderSelectedOption?: ({
    toggleMenu,
    isMenuOpen,
    selectRef
  }: RenderSelectedOptionParams) => ReactNode
}
export type SelectProps = CommonSelectProps & {
  options: SelectValue[]
}

export type SectionedSelectProps = CommonSelectProps &
  Pick<
    SectionListProps<SelectValue>,
    'sections' | 'renderSectionHeader' | 'SectionSeparatorComponent' | 'stickySectionHeadersEnabled'
  > & { headerHeight: number }
