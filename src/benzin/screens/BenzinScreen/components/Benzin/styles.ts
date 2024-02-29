import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  backgroundImage: ViewStyle
  container: ViewStyle
  content: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    backgroundImage: {
      ...flexbox.flex1,
      width: '100%',
      height: '100%'
    },
    container: {
      ...flexbox.flex1,
      ...flexbox.alignCenter,
      ...spacings.pv,
      ...spacings.phLg
    },
    content: {
      maxWidth: 620,
      width: '100%'
    }
  })

export default getStyles
