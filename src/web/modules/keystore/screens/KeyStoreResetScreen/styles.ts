import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  logo: ViewStyle
  text: TextStyle
  currentEmailContainer: ViewStyle
  currentEmailLabel: TextStyle
  currentEmailValue: TextStyle
  button: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  logo: {
    ...spacings.mbXl
  },
  text: {
    ...spacings.mbMd,
    textAlign: 'center'
  },
  currentEmailContainer: {
    ...spacings.pvSm,
    ...spacings.phSm,
    backgroundColor: colors.zircon,
    borderRadius: 12
  },
  currentEmailLabel: {
    textAlign: 'center'
  },
  currentEmailValue: {
    color: colors.violet
  },
  button: {
    width: 296
  }
})

export default styles
