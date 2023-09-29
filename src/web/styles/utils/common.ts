import { ViewStyle } from 'react-native'

import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'

interface Styles {
  contentContainer: ViewStyle
}

const commonWebStyles: Styles = {
  contentContainer: {
    maxWidth: TAB_CONTENT_WIDTH,
    width: '100%',
    marginHorizontal: 'auto'
  }
}

export default commonWebStyles
