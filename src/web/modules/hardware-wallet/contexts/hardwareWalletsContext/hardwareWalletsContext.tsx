import React, { createContext, useCallback, useMemo, useState } from 'react'

import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import LedgerController from '@web/modules/hardware-wallet/services/ledgerController'

import {
  HARDWARE_WALLETS_KEYS,
  hardwareWalletsContextDefaults,
  HardwareWalletsContextReturnType
} from './types'

const HardwareWalletsContext = createContext<HardwareWalletsContextReturnType>(
  hardwareWalletsContextDefaults
)

const HardwareWalletsProvider: React.FC<any> = ({ children }: any) => {
  const [hardwareWallets] = useState<HardwareWalletsContextReturnType['hardwareWallets']>({
    [HARDWARE_WALLETS.LEDGER]: new LedgerController()
  })

  const shouldRequestPermission = useCallback(
    (type: typeof HARDWARE_WALLETS[HARDWARE_WALLETS_KEYS]) => {
      if (type === HARDWARE_WALLETS.LEDGER) {
        return true
      }

      return false
    },
    []
  )

  return (
    <HardwareWalletsContext.Provider
      value={useMemo(
        () => ({
          hardwareWallets,
          shouldRequestPermission
        }),
        [hardwareWallets, shouldRequestPermission]
      )}
    >
      {children}
    </HardwareWalletsContext.Provider>
  )
}

export { HardwareWalletsContext, HardwareWalletsProvider }
