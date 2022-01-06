import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  row: ViewStyle
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
  rowItem: {
    paddingHorizontal: 15,
    paddingVertical: 10
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
