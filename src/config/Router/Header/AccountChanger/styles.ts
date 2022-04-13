import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Styles {
  accountContainerActive: ViewProps
  activeBlockieStyle: ViewProps
}

const styles = StyleSheet.create<Styles>({
  accountContainerActive: {
    backgroundColor: colors.howl,
    borderRadius: 13,
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
