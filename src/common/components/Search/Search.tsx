import React from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

import SearchIcon from '@common/assets/svg/SearchIcon'
import colors from '@common/styles/colors'

import styles from './styles'

const Search = () => {
  return (
    <View style={styles.searchSection}>
      <SearchIcon color={colors.martinique_65} />
      <TextInput
        editable
        numberOfLines={1}
        maxLength={25}
        placeholder="Search"
        style={[styles.textarea]}
        placeholderTextColor={colors.martinique_65}
      />
    </View>
  )
}

export default Search
