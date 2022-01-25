import { StyleSheet } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

const styles = StyleSheet.create({
  providerContainer: {
    flexDirection: 'row',
    ...spacings.phSm,
    ...spacings.pv,
    ...spacings.mbSm,
    backgroundColor: colors.listItemColor
  },
  descriptiveTextSpacing: {
    marginBottom: 2
  }
})

export default styles
