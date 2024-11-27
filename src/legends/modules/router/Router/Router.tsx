import React, { FC, ReactNode } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { DomainsContextProvider } from '@common/contexts/domainsContext'
import PrivateRoute from '@legends/components/PrivateRoute'
import { LeaderboardContextProvider } from '@legends/contexts/leaderboardContext'
import { LegendsContextProvider } from '@legends/contexts/legendsContext'
import { PortfolioControllerStateProvider } from '@legends/contexts/portfolioControllerStateContext'
import { RecentActivityContextProvider } from '@legends/contexts/recentActivityContext'
import Character from '@legends/modules/character/screens/Character'
import CharacterSelect from '@legends/modules/character/screens/CharacterSelect'
import Leaderboard from '@legends/modules/leaderboard/screens/Leaderboard'
import Legends from '@legends/modules/legends/screens/Legends'
import Welcome from '@legends/modules/welcome/screens/Welcome'

import { LEGENDS_ROUTES } from '../constants'

// In LegendsInit.tsx, we've already declared some top-level contexts that all child components use.
// However, we also have private contexts/components within a `PrivateArea`
// which are only accessible if an account is connected and a character has been selected.
// To avoid adding branches in these components
// or checking within each useCallback/useEffect whether the account/character are set,
// we chose to render these contexts only when the necessary data is set at the top level.
// Here's the flow:
// LegendInit (top-level context)
//  -> Router
//      -> Private Area contexts are initialized
//         -> PrivateRoute (prevents loading child routes if no account/character is set)
//              -> child Route.
const PrivateArea: FC<{ children: ReactNode }> = ({ children }) => (
  <LeaderboardContextProvider>
    <RecentActivityContextProvider>
      <LegendsContextProvider>
        <PortfolioControllerStateProvider>
          <DomainsContextProvider>{children}</DomainsContextProvider>
        </PortfolioControllerStateProvider>
      </LegendsContextProvider>
    </RecentActivityContextProvider>
  </LeaderboardContextProvider>
)

const router = createHashRouter([
  {
    path: LEGENDS_ROUTES.welcome,
    element: <Welcome />,
    index: true
  },
  {
    path: LEGENDS_ROUTES.characterSelect,
    element: <CharacterSelect />
  },
  {
    element: (
      <PrivateArea>
        <PrivateRoute />
      </PrivateArea>
    ),
    children: [
      {
        path: LEGENDS_ROUTES.legends,
        element: <Legends />
      },
      {
        path: LEGENDS_ROUTES.leaderboard,
        element: <Leaderboard />
      },
      {
        path: LEGENDS_ROUTES.character,
        element: <Character />
      }
    ]
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router
