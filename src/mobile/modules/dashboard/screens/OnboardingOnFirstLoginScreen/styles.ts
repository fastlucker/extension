import { StyleSheet, TextStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Style {
  titleText: TextStyle
  descriptionText: TextStyle
}

const styles = StyleSheet.create<Style>({
  titleText: {
    textAlign: 'center',
    marginHorizontal: 40,
    ...spacings.mb,
    ...spacings.mt
  },
  descriptionText: {
    textAlign: 'center',
    marginBottom: 70,
    marginHorizontal: 40,
    ...spacings.mt
  }
})

export default styles
