import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Character from '@legends/modules/character/screens/Character'
import CharacterSelect from '@legends/modules/character/screens/character-select/CharacterSelect'
import Legends from '@legends/modules/legends/screens/Legends'
import Leaderboard from '@legends/modules/router/components/Leaderboard'
import Welcome from '@legends/modules/welcome/screens/Welcome'

import { LEGENDS_ROUTES } from '../constants'

const router = createBrowserRouter([
  {
    path: LEGENDS_ROUTES.welcome,
    element: <Welcome />,
    index: true
  },
  {
    path: LEGENDS_ROUTES.legends,
    element: <Legends />
  },
  {
    path: LEGENDS_ROUTES.characterSelect,
    element: <CharacterSelect />
  },
  {
    path: LEGENDS_ROUTES.leaderboard,
    element: <Leaderboard />
  },
  {
    path: LEGENDS_ROUTES.character,
    element: <Character />
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
