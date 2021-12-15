import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  container: ViewStyle
  checkbox: ViewStyle
  label: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
  },
})

export default styles
