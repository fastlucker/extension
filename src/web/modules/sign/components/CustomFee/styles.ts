import { StyleSheet, ViewStyle, TextStyle } from 'react-native'

interface Style {
  icon: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Style>({
  icon: {
    marginBottom: 5
  },
  text: {
    fontSize: 14
  }
})

export default styles
