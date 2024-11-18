import { useMemo } from 'react'

import { AccountId } from '@ambire-common/interfaces/account'
import { Banner as BannerInterface } from '@ambire-common/interfaces/banner'
import useConnectivity from '@common/hooks/useConnectivity'
import useDebounce from '@common/hooks/useDebounce'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'

const getCurrentAccountBanners = (banners: BannerInterface[], selectedAccount?: AccountId) =>
  banners.filter((banner) => {
    if (!banner.accountAddr) return true

    return banner.accountAddr === selectedAccount
  })

const OFFLINE_BANNER: BannerInterface = {
  id: 'offline-banner',
  type: 'error',
  title: "You're offline",
  text: 'Please check your internet connection',
  actions: []
}

export default function useBanners(): BannerInterface[] {
  const state = useMainControllerState()
  const { isOffline } = useConnectivity()
  // Debounce offline status to prevent banner flickering
  const debouncedIsOffline = useDebounce({ value: isOffline, delay: 1000 })
  const { account, defiPositionsBanners } = useSelectedAccountControllerState()
  const { banners: portfolioBanners = [] } = usePortfolioControllerState()
  const { banners: activityBanners = [] } = useActivityControllerState()
  const { banners: emailVaultBanners = [] } = useEmailVaultControllerState()
  const { banners: actionBanners = [] } = useActionsControllerState()
  const { banners: swapAndBridgeBanners = [] } = useSwapAndBridgeControllerState()
  const { banners: keystoreBanners = [] } = useKeystoreControllerState()

  const allBanners = useMemo(() => {
    return [
      ...state.banners,
      ...actionBanners,
      ...swapAndBridgeBanners,
      ...defiPositionsBanners,
      // Don't display portfolio banners when offline
      ...getCurrentAccountBanners(
        debouncedIsOffline ? [OFFLINE_BANNER] : portfolioBanners,
        account?.addr
      ),
      ...activityBanners,
      ...getCurrentAccountBanners(emailVaultBanners, account?.addr),
      ...keystoreBanners
    ]
  }, [
    state.banners,
    actionBanners,
    swapAndBridgeBanners,
    defiPositionsBanners,
    debouncedIsOffline,
    portfolioBanners,
    account,
    activityBanners,
    emailVaultBanners,
    keystoreBanners
  ])

  return allBanners
}
