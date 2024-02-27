import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'

interface Style {
  modal: ViewStyle
  modalInner: ViewStyle
  modalHeader: ViewStyle
  sideContainer: ViewStyle
  backButton: ViewStyle
  closeIcon: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    modal: {
      maxWidth: TAB_CONTENT_WIDTH
    },
    modalInner: {
      width: '100%',
      ...flexbox.alignCenter
    },
    modalHeader: {
      position: 'relative',
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      ...spacings.mbLg,
      width: '100%'
    },
    sideContainer: {
      width: 120,
      minWidth: 120,
      ...flexbox.justifyCenter
    },
    backButton: {
      ...flexbox.alignSelfStart
    },
    closeIcon: {
      ...flexbox.alignSelfEnd
    }
  })

export default getStyles
