import { StyleSheet, TextStyle } from 'react-native'

import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'
import spacings from '@modules/common/styles/spacings'

interface Style {
  menuTitle: TextStyle
  link: TextStyle
}

const styles = StyleSheet.create<Style>({
  menuTitle: {
    fontFamily: FONT_FAMILIES.MEDIUM,
    ...spacings.mbTy
  },
  link: {
    fontSize: 16,
    ...spacings.mbSm
  }
})

export default styles
