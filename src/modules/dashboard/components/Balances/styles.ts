import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  otherBalancesTextHighlight: TextStyle
  activityIndicator: ViewStyle
  otherBalancesContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  activityIndicator: {
    marginBottom: 15,
    marginLeft: 15
  },
  otherBalancesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.8
  },
  otherBalancesTextHighlight: {
    fontWeight: '500'
  }
})

export default styles
