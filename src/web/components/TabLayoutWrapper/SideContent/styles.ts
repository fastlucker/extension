import { Dimensions, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Style {
  sideContentContainer: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    sideContentContainer: {
      ...spacings.ph0,
      ...spacings.plXl,
      maxWidth: 582,
      minWidth: 300,
      // TODO: this is a temp solution because Dimensions gets the static sizes of the window and doesn't update dynamically
      width: Dimensions.get('window').width < 1300 ? 300 : '30%',
      overflow: 'hidden'
    }
  })

export default getStyles
