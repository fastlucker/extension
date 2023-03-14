import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'

interface Style {
  container: ViewStyle
  segment: ViewStyle
  active: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    height: 40
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent'
  },
  active: {
    borderColor: colors.turquoise
  }
})

export default styles
