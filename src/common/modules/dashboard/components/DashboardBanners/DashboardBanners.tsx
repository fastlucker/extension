import React, { FC, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { Banner as BannerInterface } from '@ambire-common/interfaces/banner'
import Banner from '@common/modules/dashboard/components/DashboardBanner'
import spacings from '@common/styles/spacings'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useWalletStateController from '@web/hooks/useWalletStateController'

const DashboardBanners: FC = () => {
  const state = useMainControllerState()
  const [innerBanners, setInnerBanners] = useState<BannerInterface[]>([])
  const walletState = useWalletStateController()

  useEffect(() => {
    if (!walletState.isDefaultWallet) {
      setInnerBanners((prev) => {
        return [
          ...prev,
          {
            id: 'enable-default-wallet',
            topic: 'WARNING',
            title: 'Ambire Wallet is not your default wallet',
            text: 'Another wallet is set as default browser wallet for connecting with dApps. You can switch it to Ambire Wallet.',
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
  }, [walletState.isDefaultWallet])

  const allBanners = useMemo(() => {
    return [...innerBanners, ...state.banners]
  }, [innerBanners, state.banners])

  if (allBanners.length === 0) return null

  return (
    <View style={spacings.mbSm}>
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

export default React.memo(DashboardBanners)
