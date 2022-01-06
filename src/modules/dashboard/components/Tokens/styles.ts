import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Style {
  row: ViewStyle
  header: ViewStyle
  headerTitle: ViewStyle
  rowItem: ViewStyle
  img: ImageStyle
  balance: TextStyle
  balanceFiat: TextStyle
  symbol: TextStyle
}

const styles = StyleSheet.create<Style>({
  row: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: colors.headerColor,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  headerTitle: {
    fontSize: 20,
    paddingBottom: 0
  },
  rowItem: {
    paddingHorizontal: 15,
    paddingVertical: 15
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
  }
})

export default styles
