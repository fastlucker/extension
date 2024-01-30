import React, { createContext, useEffect, useMemo, useState } from 'react'

import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState/useMainControllerState'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import useWalletStateController from '@web/hooks/useWalletStateController'

const ControllersStateLoadedContext = createContext<{
  areControllerStatesLoaded: boolean
  isStatesLoadingTakingTooLong: boolean
}>({
  areControllerStatesLoaded: false,
  isStatesLoadingTakingTooLong: false
})

const ControllersStateLoadedProvider: React.FC<any> = ({ children }) => {
  const [areControllerStatesLoaded, setAreControllerStatesLoaded] = useState(false)
  const [isStatesLoadingTakingTooLong, setIsStatesLoadingTakingTooLong] = useState(false)
  const accountAdderState = useAccountAdderControllerState()
  const keystoreState = useKeystoreControllerState()
  const mainState = useMainControllerState()
  const walletState = useWalletStateController()
  const signMessageState = useSignMessageControllerState()
  const notificationState = useNotificationControllerState()
  const activityState = useActivityControllerState()
  const { state: portfolioState } = usePortfolioControllerState()
  const settingsState = useSettingsControllerState()
  const emailVaultState = useEmailVaultControllerState()

  useEffect(() => {
    // Safeguard against a potential race condition where one of the controller
    // states might not update properly and the `areControllerStatesLoaded`
    // might get stuck in `false` state forever. If the timeout gets reached,
    // the app displays feedback to the user (via the
    // `isStatesLoadingTakingTooLong` flag).
    const timeout = setTimeout(() => setIsStatesLoadingTakingTooLong(true), 10000)

    // Initially we set all controller states to empty object
    // if the states of all controllers are not an empty object
    // state data has been returned from the background service
    // so we update the areControllerStatesLoaded to true
    if (
      Object.keys(mainState).length &&
      Object.keys(walletState).length &&
      walletState?.isReady &&
      Object.keys(accountAdderState).length &&
      Object.keys(keystoreState).length &&
      Object.keys(signMessageState).length &&
      Object.keys(notificationState).length &&
      Object.keys(portfolioState).length &&
      Object.keys(activityState).length &&
      Object.keys(settingsState).length &&
      Object.keys(emailVaultState).length &&
      emailVaultState.isReady
    ) {
      clearTimeout(timeout)
      setAreControllerStatesLoaded(true)
    }

    return () => clearTimeout(timeout)
  }, [
    mainState,
    walletState,
    accountAdderState,
    keystoreState,
    signMessageState,
    notificationState,
    portfolioState,
    activityState,
    settingsState,
    areControllerStatesLoaded,
    emailVaultState
  ])

  return (
    <ControllersStateLoadedContext.Provider
      value={useMemo(
        () => ({ areControllerStatesLoaded, isStatesLoadingTakingTooLong }),
        [areControllerStatesLoaded, isStatesLoadingTakingTooLong]
      )}
    >
      {children}
    </ControllersStateLoadedContext.Provider>
  )
}

export { ControllersStateLoadedProvider, ControllersStateLoadedContext }
