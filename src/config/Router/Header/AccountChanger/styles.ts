import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings, { SPACING_SM } from '@modules/common/styles/spacings'

interface Styles {
  accountContainerActive: ViewProps
  activeBlockieStyle: ViewProps
}

const styles = StyleSheet.create<Styles>({
  accountContainerActive: {
    backgroundColor: colors.howl,
    borderRadius: 13,
    // Because the content goes beyond the parent wrapper
    marginHorizontal: -1 * SPACING_SM,
    ...spacings.pvTy,
    ...spacings.phSm
  },
  activeBlockieStyle: {
    borderWidth: 3,
    borderRadius: 50,
    borderColor: colors.lightViolet
  }
})

export default styles
