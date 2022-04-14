import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Styles {
  container: ViewStyle
  navIconContainerRegular: ViewStyle
  navIconContainerSmall: ViewStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: colors.wooed,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  navIconContainerRegular: {
    width: 40,
    alignItems: 'center'
  },
  navIconContainerSmall: {
    width: 24,
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    flex: 1,
    // So it is vertically aligned well with the nav buttons,
    // even when there are none.
    paddingVertical: 7
  }
})

export default styles
