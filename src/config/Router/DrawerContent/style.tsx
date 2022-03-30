import { StyleSheet, TextStyle } from 'react-native'

import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'
import spacings from '@modules/common/styles/spacings'

interface Style {
  menuTitle: TextStyle
}

const styles = StyleSheet.create<Style>({
  menuTitle: {
    fontFamily: FONT_FAMILIES.MEDIUM,
    ...spacings.mbTy
  }
})

export default styles
