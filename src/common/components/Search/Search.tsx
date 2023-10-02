import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { ViewProps } from 'react-native'

import SearchIcon from '@common/assets/svg/SearchIcon'
import useTheme from '@common/hooks/useTheme'

import Input from '../Input'
import styles from './styles'

type Props = {
  placeholder?: string
  style?: ViewProps
  control: Control<{ search: string }, any>
}

const Search = ({ placeholder = 'Search', style, control }: Props) => {
  const { theme } = useTheme()
  return (
    <Controller
      control={control}
      name="search"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          containerStyle={styles.inputContainer}
          leftIcon={() => <SearchIcon color={theme.secondaryText} />}
          placeholder={placeholder}
          style={style}
          inputWrapperStyle={styles.input}
          inputStyle={styles.input}
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
