import { useEffect, useMemo, useState } from 'react'

import { Banner as BannerInterface } from '@ambire-common/interfaces/banner'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useWalletStateController from '@web/hooks/useWalletStateController'

export default function useBanners(): BannerInterface[] {
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

  return allBanners
}
