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
            id: 'switch-default-wallet',
            type: 'warning',
            title: 'Ambire Wallet is not your default wallet',
            text: 'Another wallet is set as default browser wallet for connecting with dApps. You can switch it to Ambire Wallet.',
            actions: [
              {
                label: 'Switch',
                actionName: 'switch-default-wallet',
                meta: {}
              }
            ]
          }
        ]
      })
    } else {
      setInnerBanners((prev) => prev.filter((b) => b.id !== 'switch-default-wallet'))
    }
  }, [walletState.isDefaultWallet])

  const allBanners = useMemo(() => {
    return [...innerBanners, ...state.banners]
  }, [innerBanners, state.banners])

  return allBanners
}
