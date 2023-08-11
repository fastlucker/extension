import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
  textarea: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.melrose_15,
    borderColor: colors.scampi_20,
    borderWidth: 1,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.ph,
    ...spacings.pv,
    ...spacings.mbSm
  },
  textarea: {
    padding: 10,
    backgroundColor: colors.melrose_15,
    borderColor: colors.scampi_20,
    color: colors.martinique,
    borderWidth: 1,
    borderRadius: 12,
    width: 250,
    ...spacings.mrTy
  }
})

export default styles
