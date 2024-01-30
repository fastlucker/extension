import { StyleSheet, ViewStyle } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  signButtonContainer: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      ...flexbox.flex1,
      // zIndex is 0 by default. We need to set it to 'unset' to make sure the shadow isn't visible
      // when we show the select signer overlay
      // @ts-ignore
      zIndex: 'unset'
    },
    signButtonContainer: { position: 'relative', zIndex: 'unset' }
  })

export default getStyles
