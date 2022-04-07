import { StyleSheet, ViewProps, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Styles {
  switcherContainer: ViewStyle
  separator: ViewProps
}

const styles = StyleSheet.create<Styles>({
  switcherContainer: {
    backgroundColor: colors.valhalla,
    height: 50,
    borderRadius: 13,
    paddingLeft: 10,
    paddingRight: 15,
    marginHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  separator: {
    height: 1,
    borderBottomWidth: 0.5,
    borderColor: colors.waikawaGray
  }
})

export default styles
