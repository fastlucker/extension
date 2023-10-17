/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { EmailVaultController } from '@ambire-common/controllers/emailVault/emailVault'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'

const EmailVaultControllerStateContext = createContext<EmailVaultController>(
  {} as EmailVaultController
)

const EmailVaultControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as EmailVaultController)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: 'emailVault' }
    })
  }, [dispatch])

  useEffect(() => {
    const onUpdate = (newState: EmailVaultController) => {
      setState(newState)
    }

    eventBus.addEventListener('emailVault', onUpdate)

    return () => eventBus.removeEventListener('emailVault', onUpdate)
  }, [])

  return (
    <EmailVaultControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </EmailVaultControllerStateContext.Provider>
  )
}

export { EmailVaultControllerStateProvider, EmailVaultControllerStateContext }
