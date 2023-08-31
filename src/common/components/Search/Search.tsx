import React from 'react'
import { View, ViewProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import SearchIcon from '@common/assets/svg/SearchIcon'
import colors from '@common/styles/colors'

import styles from './styles'

type Props = {
  placeholder?: string
  style?: ViewProps
}

const Search = ({ placeholder = 'Search', style }: Props) => {
  return (
    <View style={[styles.searchSection, style]}>
      <SearchIcon color={colors.martinique_65} />
      <TextInput
        editable
        numberOfLines={1}
        maxLength={25}
        placeholder={placeholder}
        style={[styles.textarea]}
        placeholderTextColor={colors.martinique_65}
      />
    </View>
  )
}

export default Search
