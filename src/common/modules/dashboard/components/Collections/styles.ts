import { StyleSheet, TextStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  noCollectibles: TextStyle
}

const styles = StyleSheet.create<Style>({
  noCollectibles: { ...flexbox.flex1, textAlign: 'center', ...spacings.mtMd }
})

export default styles
