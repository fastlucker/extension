import { StyleSheet, ViewStyle } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'
import { isOpera } from '@web/constants/browserapi'
import { POPUP_WIDTH } from '@web/constants/spacings'
import { getUiType } from '@web/utils/uiType'

interface Style {
  container: ViewStyle
}

const { isPopup, isActionWindow } = getUiType()

const getStyles = () =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...(isPopup ? { maxWidth: POPUP_WIDTH } : {}),
      // to prevent content to be overlapped by the action-window's top bar on Opera
      ...(isOpera() && isActionWindow ? { paddingTop: 15 } : {})
    }
  })

export default getStyles
