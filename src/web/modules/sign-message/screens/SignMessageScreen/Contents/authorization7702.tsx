import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import React from 'react'
import { View } from 'react-native'

const Authorization7702 = () => {
  return (
    <TabLayoutWrapperMainContent style={spacings.mbLg} contentContainerStyle={spacings.pvXl}>
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween,
          spacings.mbLg
        ]}
      >
        Do you want to make your Basic Account smarter? There should be a better styled text here
        explaining in human language what a smart account is and what are the benefits
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default React.memo(Authorization7702)
