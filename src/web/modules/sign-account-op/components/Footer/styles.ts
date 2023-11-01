import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  addMoreTxnButton: ViewStyle
  signButton: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      ...spacings.ph3Xl,
      ...flexbox.flex1,
      ...common.shadowPrimary,
      shadowOpacity: 0.1,
      shadowOffset: {
        width: 0,
        height: -3
      },
      // zIndex is 0 by default. We need to set it to 'unset' to make sure the shadow isn't visible
      // when we show the select signer overlay
      // @ts-ignore
      zIndex: 'unset'
    }
  })

export default getStyles
