import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  transactionsContainer: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    transactionsContainer: {
      flex: 1
    }
  })

export default getStyles
