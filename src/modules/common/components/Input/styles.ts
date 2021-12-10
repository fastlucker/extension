import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  input: ViewStyle
}

const styles = StyleSheet.create<Style>({
  input: {
    height: 40,
    borderBottomWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
})

export default styles
