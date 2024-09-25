import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { PortfolioControllerStateProvider } from '@legends/contexts/portfolioControllerStateContext'
import Legends from '@legends/modules/legends/screens/Legends'
import Leaderboard from '@legends/modules/router/components/Leaderboard'
import Welcome from '@legends/modules/welcome/screens/Welcome'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
    index: true
  },
  {
    path: '/legends',
    element: <Legends />
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />
  }
])

const Router = () => {
  return (
    <PortfolioControllerStateProvider>
      <RouterProvider router={router} />
    </PortfolioControllerStateProvider>
  )
}

export default Router
