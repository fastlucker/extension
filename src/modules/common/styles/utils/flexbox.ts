import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  flex1: ViewStyle
  directionRow: ViewStyle
  center: ViewStyle
  alignSelfCenter: ViewStyle
  alignCenter: ViewStyle
  alignEnd: ViewStyle
  justifyCenter: ViewStyle
  wrap: ViewStyle
  justifySpaceBetween: ViewStyle
  justifyEnd: ViewStyle
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
  alignEnd: {
    alignItems: 'flex-end'
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
  },
  justifySpaceBetween: {
    justifyContent: 'space-between'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  }
})

export default flexboxStyles
