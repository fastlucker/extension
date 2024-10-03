import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ChooseCharacter from '@legends/modules/legends/screens/ChooseCharacter'
import Legends from '@legends/modules/legends/screens/Legends'
import Welcome from '@legends/modules/welcome/screens/Welcome'

import PrivateRoute from '@legends/components/PrivateRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
    index: true
  },
  {
    path: '/legends',
    element: <PrivateRoute />,
    children: [{ path: '/legends', element: <Legends /> }]
  },
  {
    path: '/choose-character',
    element: <ChooseCharacter />
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
