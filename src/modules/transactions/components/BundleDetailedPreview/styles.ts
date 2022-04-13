import { StyleSheet } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

const styles = StyleSheet.create({
  container: {
    ...spacings.pv,
    ...spacings.ph,
    ...spacings.mbSm,
    backgroundColor: colors.panelBackgroundColor
  },
  panel: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 13
  }
})

export default styles
