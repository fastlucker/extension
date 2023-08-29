import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'
import spacings from '@common/styles/spacings'

interface Style {
  container: ViewStyle
  rejectButton: ViewStyle
  addMoreTxnButton: ViewStyle
  signButton: ViewStyle
}

const button = {
  width: 230,
  height: 66,
  marginBottom: 0
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween,
    ...spacings.phLg,
    backgroundColor: colors.zircon,
    paddingVertical: 20
  },
  rejectButton: {
    ...button,
    backgroundColor: colors.zircon
  },
  addMoreTxnButton: {
    ...button,
    marginRight: 24
  },
  signButton: {
    ...button
  }
})

export default styles
