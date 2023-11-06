import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { ViewProps } from 'react-native'

import SearchIcon from '@common/assets/svg/SearchIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import Input from '../Input'

type Props = {
  placeholder?: string
  style?: ViewProps
  control: Control<{ search: string }, any>
  height?: number
}

const Search = ({ placeholder = 'Search', style, control, height = 40 }: Props) => {
  const { theme } = useTheme()
  return (
    <Controller
      control={control}
      name="search"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          containerStyle={spacings.mb0}
          leftIcon={() => <SearchIcon color={theme.secondaryText} />}
          placeholder={placeholder}
          style={style}
          inputWrapperStyle={{ height }}
          inputStyle={{ height }}
          placeholderTextColor={theme.secondaryText}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
        />
      )}
    />
  )
}

export default Search
