import React, { FC } from 'react'
import { View } from 'react-native'

import useBanners from '@common/hooks/useBanners'
import { BannerTopic } from '@web/extension-services/background/controllers/banners'

import Banner from '../Banner/Banner'

interface Props {
  topics: BannerTopic[]
}

const Banners: FC<Props> = ({ topics }) => {
  const { banners } = useBanners()

  return (
    <View>
      {banners
        .filter((banner) => {
          if (typeof banner.topic !== 'string') return false

          return topics.includes(banner.topic as unknown as typeof topics[number])
        })
        .map((banner) => (
          <Banner
            isHideBtnShown={banner?.isHideBtnShown}
            topic={banner?.topic}
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
