import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

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
    borderColor: colors.primaryAccentColor
  }
})

export default styles
