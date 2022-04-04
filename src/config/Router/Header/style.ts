import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Styles {
  container: ViewStyle
  switcherContainer: ViewStyle
  navIconContainer: ViewStyle
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
  navIconContainer: {
    // So that on the left and on the right side, there is always reserved space
    // for the nav bar buttons. And so that in case a title is present,
    // it is centered always in the logical horizontal middle.
    width: 40
  },
  title: {
    textAlign: 'center',
    flex: 1
  }
})

export default styles
