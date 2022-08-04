import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  backIconWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  backIconWrapper: {
    position: 'absolute'
  }
})

export default styles
