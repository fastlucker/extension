import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  container: ViewStyle
  searchBar: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    container: {
      ...commonWebStyles.contentContainer,
      ...spacings.pv0,
      ...spacings.ph0
    },
    searchBar: {
      ...spacings.pvSm,
      width: '100%'
    }
  })

export default getStyles
