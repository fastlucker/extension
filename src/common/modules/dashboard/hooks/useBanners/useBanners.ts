import { useMemo } from 'react'

import { AccountId } from '@ambire-common/interfaces/account'
import { Banner as BannerInterface } from '@ambire-common/interfaces/banner'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import useExtensionUpdateControllerState from '@web/hooks/useExtensionUpdateControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
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
  const { isOffline, banners: mainCtrlBanners } = useMainControllerState()
  const {
    account,
    defiPositionsBanners,
    portfolio,
    portfolioBanners,
    deprecatedSmartAccountBanner
  } = useSelectedAccountControllerState()
  const { banners: activityBanners = [] } = useActivityControllerState()
  const { banners: emailVaultBanners = [] } = useEmailVaultControllerState()
  const { banners: actionBanners = [] } = useActionsControllerState()
  const { banners: swapAndBridgeBanners = [] } = useSwapAndBridgeControllerState()
  const { banners: keystoreBanners = [] } = useKeystoreControllerState()
  const { extensionUpdateBanner } = useExtensionUpdateControllerState()

  const allBanners = useMemo(() => {
    return [
      ...deprecatedSmartAccountBanner,
      ...mainCtrlBanners,
      ...actionBanners,
      ...(isOffline && portfolio.isAllReady ? [OFFLINE_BANNER] : []),
      ...(isOffline ? [] : [...swapAndBridgeBanners, ...defiPositionsBanners, ...portfolioBanners]),
      ...activityBanners,
      ...getCurrentAccountBanners(emailVaultBanners, account?.addr),
      ...keystoreBanners,
      ...extensionUpdateBanner
    ]
  }, [
    deprecatedSmartAccountBanner,
    mainCtrlBanners,
    actionBanners,
    isOffline,
    portfolio.isAllReady,
    swapAndBridgeBanners,
    defiPositionsBanners,
    portfolioBanners,
    activityBanners,
    emailVaultBanners,
    account?.addr,
    keystoreBanners,
    extensionUpdateBanner
  ])

  return allBanners
}
