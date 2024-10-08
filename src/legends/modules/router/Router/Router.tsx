import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Character from '@legends/modules/character/screens/Character'
import CharacterSelect from '@legends/modules/character/screens/CharacterSelect'
import Legends from '@legends/modules/legends/screens/Legends'
import Leaderboard from '@legends/modules/leaderboard/screens/Leaderboard'
import Welcome from '@legends/modules/welcome/screens/Welcome'
import PrivateRoute from '@legends/components/PrivateRoute'

import { LEGENDS_ROUTES } from '../constants'

const router = createBrowserRouter([
  {
    path: LEGENDS_ROUTES.welcome,
    element: <Welcome />,
    index: true
  },
  {
    path: LEGENDS_ROUTES.legends,
    element: <PrivateRoute />,
    children: [{ path: LEGENDS_ROUTES.legends, element: <Legends /> }]
  },
  {
    path: LEGENDS_ROUTES.characterSelect,
    element: <CharacterSelect />
  },
  {
    path: LEGENDS_ROUTES.leaderboard,
    element: <PrivateRoute />,
    children: [{ path: LEGENDS_ROUTES.leaderboard, element: <Leaderboard /> }]
  },
  {
    path: LEGENDS_ROUTES.character,
    element: <PrivateRoute />,
    children: [{ path: LEGENDS_ROUTES.character, element: <Character /> }]
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
