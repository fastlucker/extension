import { StyleSheet, TextStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  menuTitle: TextStyle
}

const styles = StyleSheet.create<Style>({
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    textDecorationLine: 'underline',
    ...spacings.mbTy
  }
})

export default styles
