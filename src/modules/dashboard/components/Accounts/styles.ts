import { StyleSheet, TextProps, ViewProps } from 'react-native'

interface Styles {
  chevron: TextProps
  networkIcon: TextProps
  accItemStyle: ViewProps
  inactiveAccount: ViewProps
}

const styles = StyleSheet.create<Styles>({
  accItemStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chevron: {
    fontSize: 12
  },
  inactiveAccount: {
    opacity: 0.5
  },
  networkIcon: {
    // so it aligns better vertically within text
    marginTop: -3
  }
})

export default styles
