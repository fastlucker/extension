import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  toggleContainer: ViewStyle
  toggleItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
  toggleContainer: {
    flexDirection: 'row',
    width: '100%'
  },
  toggleItem: {
    width: '50%',
    alignItems: 'center',
    ...spacings.pvTy,
    borderTopStartRadius: 13,
    borderTopRightRadius: 13
  }
})

export default styles
