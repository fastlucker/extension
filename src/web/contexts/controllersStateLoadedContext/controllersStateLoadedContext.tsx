import React, { createContext, useEffect, useMemo, useState } from 'react'

import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState/useMainControllerState'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'

const ControllersStateLoadedContext = createContext<boolean>(false)

const ControllersStateLoadedProvider: React.FC<any> = ({ children }) => {
  const [isStateLoaded, setIsStateLoaded] = useState<boolean>(false)
  const accountAdderState = useAccountAdderControllerState()
  const keystoreState = useKeystoreControllerState()
  const mainState = useMainControllerState()
  const signMessageState = useSignMessageControllerState()
  const notificationState = useNotificationControllerState()

  useEffect(() => {
    // Initially we set all controller states to empty object
    // if the states of all controllers are not an empty object
    // state data has been returned from the background service
    // so we update the isStateLoaded to true
    if (
      !Object.keys(mainState).length &&
      !Object.keys(accountAdderState).length &&
      !Object.keys(keystoreState).length &&
      !Object.keys(signMessageState).length &&
      !Object.keys(notificationState).length
    ) {
      setIsStateLoaded(true)
    }
  }, [mainState, accountAdderState, keystoreState, signMessageState, notificationState])

  return (
    <ControllersStateLoadedContext.Provider value={useMemo(() => isStateLoaded, [isStateLoaded])}>
      {children}
    </ControllersStateLoadedContext.Provider>
  )
}

export { ControllersStateLoadedProvider, ControllersStateLoadedContext }
