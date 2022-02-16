import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  buttonsContainer: ViewStyle
  buttonWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: -5
  },
  buttonWrapper: {
    marginHorizontal: 5,
    flex: 1
  }
})

export default styles
