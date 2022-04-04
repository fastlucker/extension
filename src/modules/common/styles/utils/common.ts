import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  shadowPrimary: ViewStyle
  borderRadiusPrimary: ViewStyle
  borderRadiusSecondary: ViewStyle
}

const commonStyles = StyleSheet.create<Styles>({
  shadowPrimary: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 10,
    elevation: 9
  },
  borderRadiusPrimary: {
    borderRadius: 13
  },
  borderRadiusSecondary: {
    borderRadius: 2
  }
})

export default commonStyles
