import { PortfolioController } from 'ambire-common/src/controllers/portfolio/portfolio'
/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import eventBus from '@web/extension-services/event/eventBus'

const PortfolioControllerStateContext = createContext<PortfolioController>(
  {} as PortfolioController
)

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as PortfolioController)

  useEffect(() => {
    const onUpdate = (newState: PortfolioController) => {
      setState(newState)
    }

    eventBus.addEventListener('portfolio', onUpdate)

    return () => eventBus.removeEventListener('portfolio', onUpdate)
  }, [])

  return (
    <PortfolioControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
