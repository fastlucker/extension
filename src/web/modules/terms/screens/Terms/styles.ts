import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  logo: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  logo: {
    ...spacings.mbLg,
    ...flexbox.alignCenter
  }
})

export default styles
