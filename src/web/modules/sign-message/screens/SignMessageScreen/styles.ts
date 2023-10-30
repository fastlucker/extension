import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  content: ViewStyle
  title: TextStyle
  buttonsContainer: ViewStyle
  rejectButton: ViewStyle
  signButtonContainer: ViewStyle
  signButton: ViewStyle
  overlay: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: { ...flexbox.flex1 },
  content: { ...flexbox.flex1, ...spacings.ptXl, ...spacings.ph3Xl, ...spacings.pbLg },
  title: { ...spacings.mbXl },
  buttonsContainer: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween,
    height: 128,
    ...spacings.pvXl,
    ...spacings.ph3Xl,
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
  },
  rejectButton: { width: 130, height: 56 },
  // zIndex is 0 by default. We need to set it to 'unset' to make sure the shadow isn't visible
  // when we show the select signer overlay
  // @ts-ignore
  signButtonContainer: { position: 'relative', zIndex: 'unset' },
  signButton: { width: 162, height: 56 },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2
  }
})

export default styles
