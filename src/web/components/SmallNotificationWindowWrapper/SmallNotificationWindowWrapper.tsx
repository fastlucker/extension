import React, { FC } from 'react'
import { View } from 'react-native'

import useWindowSize from '@common/hooks/useWindowSize'

type Props = {
  children: React.ReactNode
}

const SmallNotificationWindowWrapper: FC<Props> = ({ children }) => {
  const { maxWidthSize } = useWindowSize()

  return (
    <View
      style={{
        flex: 1,
        // Even the the action window is created with a width of 720px
        // it is not guaranteed that the page will be 720px wide
        // as the user may have zoomed in or out.
        // That's why we increase the threshold to 1280px
        // < 1280px the window will be full width
        // > 1280px the window will be 720px wide
        width: maxWidthSize(1280) ? 720 : '100%',
        marginHorizontal: 'auto'
      }}
    >
      {children}
    </View>
  )
}

export default SmallNotificationWindowWrapper
