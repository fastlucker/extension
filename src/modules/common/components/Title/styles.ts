import { StyleSheet, TextStyle } from 'react-native'

interface Style {
  titleRegular: TextStyle
  titleSmall: TextStyle
  bottomSpacing: TextStyle
}

const styles = StyleSheet.create<Style>({
  titleRegular: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 20,
    letterSpacing: 0,
    lineHeight: 30
  },
  titleSmall: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    letterSpacing: 5,
    lineHeight: 25
  },
  bottomSpacing: {
    paddingBottom: 20
  }
})

export default styles
