import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Styles {
  container: ViewStyle
  switcherContainer: ViewStyle
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
  switcherContainer: {
    backgroundColor: colors.valhalla,
    height: 50,
    borderRadius: 13,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    flex: 1,
    justifyContent: 'center'
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
    flex: 1
  }
})

export default styles
