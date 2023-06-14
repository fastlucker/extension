import React from 'react'
import { TouchableHighlight, StyleSheet, View } from 'react-native'

import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import useTheme from '@common/hooks/useTheme'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 250,
    zIndex: 999,
    margin: 0,
    backgroundColor: colors.melrose_15
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    border: colors.scampi_20,
    backgroundColor: colors.melrose_15,
    zIndex: 999
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: colors.melrose_15,
    borderBottomColor: colors.scampi_20
  }
})

const Dropdown = ({ isDropdownOpen, setIsDropdownOpen, options, selectedValue, onSelect }) => {
  const { theme } = useTheme()
  const handleOptionSelect = (option) => {
    onSelect(option)
    setIsDropdownOpen(false)
  }

  return (
    <View style={styles.container}>
      {isDropdownOpen && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableHighlight
              activeOpacity={1}
              key={option.value}
              style={styles.option}
              disabled={false}
              underlayColor={colors.melrose_15}
              onPress={() => handleOptionSelect(option)}
            >
              <Text fontSize={10} color={colors.martinique}>
                {option.label}
              </Text>
            </TouchableHighlight>
          ))}
        </View>
      )}
    </View>
  )
}

export default Dropdown
