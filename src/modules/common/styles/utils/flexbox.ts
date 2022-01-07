import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  flex1: ViewStyle
  directionRow: ViewStyle
  center: ViewStyle
  alignSelfCenter: ViewStyle
}

const flexboxStyles = StyleSheet.create<Styles>({
  flex1: {
    flex: 1
  },
  directionRow: {
    flexDirection: 'row'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  alignSelfCenter: {
    alignSelf: 'center'
  }
})

export default flexboxStyles
