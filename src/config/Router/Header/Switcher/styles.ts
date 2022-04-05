import { StyleSheet, ViewProps, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Styles {
  switcherContainer: ViewStyle
  accItemStyle: ViewProps
  inactiveAccount: ViewProps
  activeBlockieStyle: ViewProps
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
  accItemStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inactiveAccount: {
    opacity: 0.5
  },
  activeBlockieStyle: {
    borderWidth: 3,
    borderRadius: 50,
    borderColor: colors.lightViolet
  }
})

export default styles
