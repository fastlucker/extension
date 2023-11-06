import { StyleSheet, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'
import { getUiType } from '@web/utils/uiType'

interface Style {
  container: ViewStyle
  content: ViewStyle
}

const { isTab } = getUiType()

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(45, 49, 77, 0.6)',
      alignItems: 'center',
      zIndex: 99,
      justifyContent: isTab ? 'center' : 'flex-end'
    },
    content: {
      height: isTab ? 'auto' : 400,
      maxWidth: isTab ? TAB_CONTENT_WIDTH : '100%',
      width: '100%',
      backgroundColor: theme.primaryBackground,
      borderTopLeftRadius: BORDER_RADIUS_PRIMARY,
      borderTopRightRadius: BORDER_RADIUS_PRIMARY,
      borderBottomLeftRadius: isTab ? BORDER_RADIUS_PRIMARY : 0,
      borderBottomRightRadius: isTab ? BORDER_RADIUS_PRIMARY : 0,
      zIndex: 100,
      ...spacings.ph,
      ...spacings.pv,
      // @ts-ignore removes the hover effect on web
      ...(isWeb ? { cursor: 'default' } : {})
    }
  })

export default getStyles
