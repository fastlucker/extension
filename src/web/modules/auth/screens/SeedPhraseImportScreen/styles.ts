import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_MI } from '@common/styles/spacings'

type Styles = {
  errorText: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Styles>({
    errorText: {
      ...spacings.phMi,
      ...spacings.mbMI,
      ...spacings.phTy,
      paddingTop: SPACING_MI / 2
    }
  })

export default getStyles
