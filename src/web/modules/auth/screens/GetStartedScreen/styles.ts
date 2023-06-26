import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import { SPACING_MD } from '@common/styles/spacings'

interface Styles {
  hr: ViewStyle
  logo: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  hr: {
    marginVertical: SPACING_MD * 2,
    height: 1,
    width: 330,
    backgroundColor: colors.scampi_20
  },
  logo: {
    position: 'absolute',
    bottom: 27,
    right: '50%',
    marginRight: -(SPACING_MD * 2),
    zIndex: 10
  }
})

export default styles
