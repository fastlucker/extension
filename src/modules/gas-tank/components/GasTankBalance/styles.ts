import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  container: ViewProps
}

const styles = StyleSheet.create<Style>({
  container: {
    borderWidth: 1,
    borderColor: colors.heliotrope,
    ...commonStyles.borderRadiusPrimary,
    ...spacings.ptTy,
    ...spacings.pbMi,
    ...spacings.phTy,
    flex: 1,
    alignItems: 'center'
  }
})

export default styles
