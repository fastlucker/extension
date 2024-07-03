import { useEffect, useMemo, useState } from 'react'

import { AccountId } from '@ambire-common/interfaces/account'
import { Banner as BannerInterface } from '@ambire-common/interfaces/banner'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useWalletStateController from '@web/hooks/useWalletStateController'

const getCurrentAccountBanners = (banners: BannerInterface[], selectedAccount: AccountId | null) =>
  banners.filter((banner) => {
    if (!banner.accountAddr) return true

    return banner.accountAddr === selectedAccount
  })

export default function useBanners(): BannerInterface[] {
  const state = useMainControllerState()
  const { selectedAccount } = useAccountsControllerState()
  const {
    state: { banners: portfolioBanners = [] }
  } = usePortfolioControllerState()
  const { banners: activityBanners = [] } = useActivityControllerState()
  const { banners: emailVaultBanners = [] } = useEmailVaultControllerState()
  const { banners: actionBanners = [] } = useActionsControllerState()

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
    return [
      ...innerBanners,
      ...state.banners,
      ...actionBanners,
      ...getCurrentAccountBanners(portfolioBanners, selectedAccount),
      ...activityBanners,
      ...getCurrentAccountBanners(emailVaultBanners, selectedAccount)
    ]
  }, [
    activityBanners,
    emailVaultBanners,
    innerBanners,
    portfolioBanners,
    state.banners,
    actionBanners,
    selectedAccount
  ])

  return allBanners
}
