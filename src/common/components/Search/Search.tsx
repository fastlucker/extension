import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { View, ViewProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import SearchIcon from '@common/assets/svg/SearchIcon'
import colors from '@common/styles/colors'

import styles from './styles'

type Props = {
  placeholder?: string
  style?: ViewProps
  control: Control<{ search: string }, any>
}

const Search = ({ placeholder = 'Search', style, control }: Props) => {
  return (
    <View style={[styles.searchSection, style]}>
      <SearchIcon color={colors.martinique_65} />
      <Controller
        control={control}
        name="search"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            editable
            numberOfLines={1}
            placeholder={placeholder}
            style={[styles.textarea]}
            placeholderTextColor={colors.martinique_65}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
          />
        )}
      />
    </View>
  )
}

export default Search
