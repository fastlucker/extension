import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_MD } from '@common/styles/spacings'

interface Style {
  mainContentWrapper: ViewStyle
  contentContainer: ViewStyle
  sideContentContainer: ViewStyle
  informationCircle: ViewStyle
  amebaAlpha: ViewStyle
  amebaBeta: ViewStyle
}

const styles = StyleSheet.create<Style>({
  mainContentWrapper: {
    width: 290,
    alignSelf: 'center',
    paddingTop: 70,
    flex: 1
  },
  contentContainer: {
    height: '100%',
    ...spacings.pbLg,
    ...spacings.ph3Xl
  },
  sideContentContainer: {
    width: '35%',
    ...spacings.ptMd,
    paddingHorizontal: SPACING_MD * 3,
    overflow: 'hidden'
  },
  informationCircle: {
    alignSelf: 'center',
    ...spacings.pbLg
  },
  amebaAlpha: {
    position: 'absolute',
    right: '50%',
    bottom: -910,
    marginRight: -825,
    zIndex: -1
  },
  amebaBeta: {
    position: 'absolute',
    right: '50%',
    bottom: -1050,
    marginRight: -825,
    zIndex: -1
  }
})

export default styles
