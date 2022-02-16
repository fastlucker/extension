import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  flex1: ViewStyle
  directionRow: ViewStyle
  center: ViewStyle
  alignSelfCenter: ViewStyle
  alignCenter: ViewStyle
  justifyCenter: ViewStyle
  wrap: ViewStyle
}

const flexboxStyles = StyleSheet.create<Styles>({
  flex1: {
    flex: 1
  },
  directionRow: {
    flexDirection: 'row'
  },
  alignCenter: {
    alignItems: 'center'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  alignSelfCenter: {
    alignSelf: 'center'
  },
  wrap: {
    flexWrap: 'wrap'
  }
})

export default flexboxStyles
