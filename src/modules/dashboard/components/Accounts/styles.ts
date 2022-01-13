import { StyleSheet, TextProps, ViewProps } from 'react-native'

interface Styles {
  chevron: TextProps
  accItemStyle: ViewProps
  accFooter: ViewProps
}

const styles = StyleSheet.create<Styles>({
  accItemStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chevron: {
    fontSize: 12
  }
})

export default styles
