import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Style {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
    elevation: 20,
    alignItems: 'center',
    ...spacings.ph
  }
})

export default styles
