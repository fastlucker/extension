import React, { FC } from 'react'
import { View } from 'react-native'

import Banner from '@common/components/Banner'
import spacings from '@common/styles/spacings'
import useMainControllerState from '@web/hooks/useMainControllerState'

const Banners: FC = () => {
  const state = useMainControllerState()

  if (state.banners.length === 0) return null

  return (
    // @TODO: better display of more than one banner in popup
    <View style={spacings.mb}>
      {(state.banners || []).map((banner) => (
        <Banner
          topic={banner.topic}
          key={banner.id}
          id={banner.id}
          title={banner.title}
          text={banner.text}
          actions={banner.actions}
        />
      ))}
    </View>
  )
}

export default React.memo(Banners)
