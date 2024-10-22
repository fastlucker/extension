import { useMemo } from 'react'

import { AccountId } from '@ambire-common/interfaces/account'
import { Banner as BannerInterface } from '@ambire-common/interfaces/banner'
import useConnectivity from '@common/hooks/useConnectivity'
import useDebounce from '@common/hooks/useDebounce'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'

const getCurrentAccountBanners = (banners: BannerInterface[], selectedAccount: AccountId | null) =>
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
  const { selectedAccount } = useAccountsControllerState()
  const { isOffline } = useConnectivity()
  // Debounce offline status to prevent banner flickering
  const debouncedIsOffline = useDebounce({ value: isOffline, delay: 1000 })
  const {
    state: { banners: portfolioBanners = [] }
  } = usePortfolioControllerState()
  const { banners: activityBanners = [] } = useActivityControllerState()
  const { banners: emailVaultBanners = [] } = useEmailVaultControllerState()
  const { banners: actionBanners = [] } = useActionsControllerState()
  const { banners: swapAndBridgeBanners = [] } = useSwapAndBridgeControllerState()

  const allBanners = useMemo(() => {
    return [
      ...state.banners,
      ...actionBanners,
      ...swapAndBridgeBanners,
      // Don't display portfolio banners when offline
      ...getCurrentAccountBanners(
        debouncedIsOffline ? [OFFLINE_BANNER] : portfolioBanners,
        selectedAccount
      ),
      ...activityBanners,
      ...getCurrentAccountBanners(emailVaultBanners, selectedAccount)
    ]
  }, [
    state.banners,
    actionBanners,
    swapAndBridgeBanners,
    debouncedIsOffline,
    portfolioBanners,
    selectedAccount,
    activityBanners,
    emailVaultBanners
  ])

  return allBanners
}
