import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'

const PrivateRoute = () => {
  const accountContext = useAccountContext()
  const characterContext = useCharacterContext()

  if (!accountContext.connectedAccount) return <Navigate to="/" />

  // Don't allow loading the Outlet component if the character is not loaded or is in the process of loading.
  if (!characterContext.character || characterContext.isLoading) return <div />

  if (characterContext.character.characterType === 'unknown')
    return <Navigate to={LEGENDS_ROUTES.characterSelect} />

  return <Outlet />
}

export default PrivateRoute
