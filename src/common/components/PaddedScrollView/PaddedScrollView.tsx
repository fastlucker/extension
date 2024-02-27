import React, { FC } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import spacings from '@common/styles/spacings'
import useIsScrollable from '@web/hooks/useIsScrollable'

interface Props extends ScrollViewProps {
  children: React.ReactNode | React.ReactNode[]
  dynamicPaddingRight?: boolean
}

const PaddedScrollView: FC<Props> = ({ children, dynamicPaddingRight = true, style, ...rest }) => {
  const { isScrollable, scrollViewRef, checkIsScrollable } = useIsScrollable()

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[isScrollable || !dynamicPaddingRight ? spacings.pr : spacings.pr0, style]}
      onContentSizeChange={checkIsScrollable}
      onLayout={checkIsScrollable}
      {...rest}
    >
      {children}
    </ScrollView>
  )
}

export default PaddedScrollView
