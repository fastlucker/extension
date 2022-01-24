import { StyleSheet } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

const styles = StyleSheet.create({
  addressCopyContainer: {
    flexDirection: 'row',
    ...spacings.phSm,
    ...spacings.pv,
    backgroundColor: colors.inputBackgroundColor
  }
})

export default styles
