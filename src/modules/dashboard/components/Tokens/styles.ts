import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Style {
  row: ViewStyle
  header: ViewStyle
  footer: ViewStyle
  headerTitle: ViewStyle
  rowItem: ViewStyle
  rowItemMain: ViewStyle
  img: ImageStyle
  balance: TextStyle
  btnContainer: ViewStyle
  btn: TextStyle
  balanceFiat: TextStyle
  symbol: TextStyle
  infoText: TextStyle
  subInfoText: TextStyle
}

const styles = StyleSheet.create<Style>({
  row: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: colors.headerColor,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footer: {
    paddingVertical: 15,
    paddingBottom: 0
  },
  headerTitle: {
    fontSize: 20,
    paddingBottom: 0
  },
  btnContainer: {
    backgroundColor: colors.secondaryButtonColor,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  btn: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  rowItem: {
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  rowItemMain: {
    flex: 1,
    paddingHorizontal: 0
  },
  img: {
    width: 35,
    height: 35
  },
  balance: {
    fontSize: 18
  },
  balanceFiat: {
    fontSize: 14
  },
  symbol: {
    fontSize: 18,
    fontWeight: '700'
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    opacity: 0.5,
    paddingBottom: 10,
    paddingLeft: 10
  },
  subInfoText: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center'
  }
})

export default styles
