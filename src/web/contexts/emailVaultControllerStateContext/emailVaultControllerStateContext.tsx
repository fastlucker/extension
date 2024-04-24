/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { EmailVaultController } from '@ambire-common/controllers/emailVault/emailVault'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

const EmailVaultControllerStateContext = createContext<EmailVaultController>(
  {} as EmailVaultController
)

const EmailVaultControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'emailVault'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller }
    })
  }, [dispatch])

  return (
    <EmailVaultControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </EmailVaultControllerStateContext.Provider>
  )
}

export { EmailVaultControllerStateProvider, EmailVaultControllerStateContext }
