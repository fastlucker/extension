import { StyleSheet } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

const styles = StyleSheet.create({
  sectionTitleWrapper: {
    backgroundColor: colors.backgroundColor,
    width: '100%',
    ...spacings.ptTy,
    ...spacings.pvSm,
    ...spacings.mbMi
  }
})

export default styles
