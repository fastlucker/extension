import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { PortfolioControllerStateProvider } from '@legends/contexts/portfolioControllerStateContext'
import Home from '@legends/modules/router/components/Home'

const Router = () => {
  return (
    <Routes>
      <Route
        index
        path="/"
        element={
          <PortfolioControllerStateProvider>
            <Home />
          </PortfolioControllerStateProvider>
        }
      />
    </Routes>
  )
}

export default Router
