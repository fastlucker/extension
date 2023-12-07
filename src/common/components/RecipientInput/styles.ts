import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  label: TextStyle
  domainIcons: ViewStyle
  plTy: ViewStyle
}

const styles = StyleSheet.create<Style>({
  label: {
    ...spacings.mbMi
  },
  domainIcons: flexbox.directionRow,
  plTy: spacings.plTy
})

export default styles
