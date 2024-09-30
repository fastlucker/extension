import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import CharacterSelect from '@legends/modules/character/screens/character-select/CharacterSelect'
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
  },
  {
    path: '/character-select',
    element: <CharacterSelect />
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
