import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  text: TextStyle
  otherBalancesText: TextStyle
  activityIndicator: ViewStyle
  otherBalancesContainer: ViewStyle
  networkLogo: ViewStyle
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
  },
  networkLogo: {
    marginHorizontal: 5
  }
})

export default styles
