import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  modal: ViewStyle
  modalHeader: ViewStyle
  sideContainer: ViewStyle
  backButton: ViewStyle
  closeIcon: ViewStyle
}

const { isTab } = getUiType()

const getStyles = () =>
  StyleSheet.create<Style>({
    modal: {
      ...flexbox.alignCenter,
      minWidth: isTab ? 798 : '100%',
      height: isTab ? 'auto' : '100%'
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
