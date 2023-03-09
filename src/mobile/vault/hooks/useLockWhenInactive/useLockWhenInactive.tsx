import { useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { VAULT_STATUS } from '@mobile/vault/constants/vaultStatus'

const useLockWhenInactive = ({
  vaultStatus,
  shouldLockWhenInactive,
  lock,
  promptToUnlock,
  biometricsEnabled
}: {
  vaultStatus: VAULT_STATUS
  shouldLockWhenInactive: boolean
  lock: () => void
  promptToUnlock: () => Promise<any>
  biometricsEnabled: boolean
}) => {
  const [, setAppState] = useState<AppStateStatus>(AppState.currentState)

  // Catches better the otherwise not extremely consistent app state change.
  // {@link https://stackoverflow.com/a/62773667/1333836}
  const handleAppStateChange = useCallback(
    (nextAppState) =>
      setAppState((currentAppState) => {
        const isNotInTheMiddleOfAskingForPermissionOrLocalAuth =
          !global.isAskingForPermission && !global.isAskingForLocalAuth

        if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
          // App has come to the foreground!
          const isLocked = [VAULT_STATUS.LOCKED_TEMPORARILY, VAULT_STATUS.LOCKED].includes(
            vaultStatus
          )
          if (isNotInTheMiddleOfAskingForPermissionOrLocalAuth && isLocked && biometricsEnabled) {
            promptToUnlock()
          }
        } else if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
          // App has come to background!
          if (
            isNotInTheMiddleOfAskingForPermissionOrLocalAuth &&
            shouldLockWhenInactive &&
            vaultStatus === VAULT_STATUS.UNLOCKED
          ) {
            lock()
          }
        }
        return nextAppState
      }),
    [vaultStatus, biometricsEnabled, promptToUnlock, shouldLockWhenInactive, lock]
  )

  useEffect(() => {
    if (!shouldLockWhenInactive) return

    const stateChange = AppState.addEventListener('change', handleAppStateChange)

    return () => stateChange.remove()
  }, [handleAppStateChange, shouldLockWhenInactive, vaultStatus])
}

export default useLockWhenInactive
