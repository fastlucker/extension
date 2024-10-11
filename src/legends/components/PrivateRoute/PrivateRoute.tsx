import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

const PrivateRoute = () => {
  const { connectedAccount, lastConnectedV2Account, isLoading } = useAccountContext()
  const { character, isLoading: isCharacterLoading } = useCharacterContext()

  if (isLoading) return null

  // If a wallet isn't connected at all or the user hasn't connect a v2 account,
  // redirect to the welcome screen. Once a v2 account has been connected once,
  // the user should be able to access screens which will display the state
  // of the v2 account.
  if (!connectedAccount || !lastConnectedV2Account) return <Navigate to="/" />

  // Don't allow loading the Outlet component if the character is not loaded or is in the process of loading.
  if (!character || isCharacterLoading) return null

  if (character.characterType === 'unknown') return <Navigate to={LEGENDS_ROUTES.characterSelect} />

  return <Outlet />
}

export default PrivateRoute
