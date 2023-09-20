import React, { FC } from 'react'
import { View } from 'react-native'

import Banner from '@common/components/Banner'
import useMainControllerState from '@web/hooks/useMainControllerState'

const Banners: FC = () => {
  const state = useMainControllerState()

  return (
    <View>
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
