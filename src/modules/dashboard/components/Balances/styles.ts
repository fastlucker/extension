import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  text: TextStyle
  otherBalancesText: TextStyle
  activityIndicator: ViewStyle
  otherBalancesContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    fontSize: 40
  },
  activityIndicator: {
    marginBottom: 15,
    marginLeft: 15
  },
  otherBalancesContainer: {
    marginTop: 20
  },
  otherBalancesText: {
    fontSize: 20
  }
})

export default styles
