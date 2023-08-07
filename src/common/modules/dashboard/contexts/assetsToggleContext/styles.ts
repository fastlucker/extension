import { StyleSheet, ViewStyle } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

interface Style {
  toggleItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
  toggleItem: {
    borderBottomWidth: 2,
    width: 150,
    ...flexbox.alignCenter
  }
})

export default styles
