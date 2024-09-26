import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Legends from '@legends/modules/legends/screens/Legends'
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
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
