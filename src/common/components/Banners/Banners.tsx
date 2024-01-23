import React, { FC, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { Banner as BannerInterface } from '@ambire-common/interfaces/banner'
import Banner from '@common/components/Banner'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

const Banners: FC = () => {
  const state = useMainControllerState()
  const [innerBanners, setInnerBanners] = useState<BannerInterface[]>([])
  const { isDefaultWallet } = useBackgroundService()
  useEffect(() => {
    if (!isDefaultWallet) {
      setInnerBanners((prev) => {
        return [
          ...prev,
          {
            id: 'enable-default-wallet',
            topic: 'WARNING',
            title: 'Ambire Wallet is blocked to override other wallets',
            text: 'You have blocked Ambire to override other extension wallets for dApps connection.',
            actions: [
              {
                label: 'Enable',
                actionName: 'enable-default-wallet',
                meta: {}
              }
            ]
          }
        ]
      })
    } else {
      setInnerBanners((prev) => prev.filter((b) => b.id !== 'enable-default-wallet'))
    }
  }, [isDefaultWallet])

  const allBanners = useMemo(() => {
    return [...innerBanners, ...state.banners]
  }, [innerBanners, state.banners])

  if (allBanners.length === 0) return null

  return (
    // @TODO: better display of more than one banner in popup
    <View style={spacings.mb}>
      {allBanners.map((banner) => (
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
