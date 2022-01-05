import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  text: TextStyle
  activityIndicator: ViewStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    fontSize: 40
  },
  activityIndicator: {
    marginBottom: 15,
    marginLeft: 15
  }
})

export default styles
