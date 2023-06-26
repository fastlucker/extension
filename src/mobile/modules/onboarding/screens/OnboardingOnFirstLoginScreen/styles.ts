import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING, SPACING_LG, SPACING_SM } from '@common/styles/spacings'

interface Style {
  titleText: TextStyle
  descriptionText: TextStyle
  dotStyle: ViewStyle
  activeDotStyle: ViewStyle
  callToActionButton: ViewStyle
  fallbackBackground: ViewStyle
}

const styles = StyleSheet.create<Style>({
  titleText: {
    textAlign: 'center',
    marginHorizontal: SPACING * 2,
    ...spacings.mb,
    ...spacings.mt
  },
  descriptionText: {
    textAlign: 'center',
    marginBottom: SPACING_LG * 2,
    marginHorizontal: SPACING * 2,
    ...spacings.mt
  },
  dotStyle: {
    backgroundColor: colors.clay
  },
  activeDotStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.clay
  },
  callToActionButton: {
    marginRight: SPACING_SM * 2,
    ...spacings.mtTy
  },
  fallbackBackground: {
    backgroundColor: colors.titan
  }
})

export default styles
