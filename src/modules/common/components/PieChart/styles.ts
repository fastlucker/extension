import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  extraLegend: ViewStyle
  extraLegendText: TextStyle
}

const styles = StyleSheet.create<Style>({
  extraLegend: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  extraLegendText: {
    fontSize: 16,
    textAlign: 'right',
    ...spacings.mtSm
  }
})

export default styles
