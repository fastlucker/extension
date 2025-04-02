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
        // For some reason, notification windows on some devices
        // are not created with the exact width of 720px.
        // That's why we've increased the tolerance of small notification windows
        // to 820px. If the window is larger than that size the
        // content will be centered.
        width: maxWidthSize(820) ? 720 : '100%',
        marginHorizontal: 'auto'
      }}
    >
      {children}
    </View>
  )
}

export default SmallNotificationWindowWrapper
