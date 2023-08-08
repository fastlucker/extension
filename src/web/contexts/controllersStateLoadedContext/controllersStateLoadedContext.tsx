import React, { createContext, useEffect, useMemo, useState } from 'react'

import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState/useMainControllerState'

const ControllersStateLoadedContext = createContext<boolean>(false)

const ControllersStateLoadedProvider: React.FC<any> = ({ children }) => {
  const [isStateLoaded, setIsStateLoaded] = useState<boolean>(false)
  const accountAdderState = useAccountAdderControllerState()
  const mainState = useMainControllerState()

  useEffect(() => {
    // Initially we set all controller states to empty object
    // if the states of all controllers are not an empty object
    // state data has been returned from the background service
    // so we update the isStateLoaded to true
    if (!Object.keys(mainState).length && !Object.keys(accountAdderState).length) {
      setIsStateLoaded(true)
    }
  }, [mainState, accountAdderState])

  return (
    <ControllersStateLoadedContext.Provider value={useMemo(() => isStateLoaded, [isStateLoaded])}>
      {children}
    </ControllersStateLoadedContext.Provider>
  )
}

export { ControllersStateLoadedProvider, ControllersStateLoadedContext }
