import { StyleSheet, TextStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Style {
  text: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    ...spacings.mbSm,
    alignSelf: 'center',
    fontSize: 24
  }
})

export default styles
