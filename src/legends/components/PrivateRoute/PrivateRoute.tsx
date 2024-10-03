import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'

const PrivateRoute = () => {
  const accountContext = useAccountContext()
  const characterContext = useCharacterContext()

  if (!accountContext.connectedAccount) return <Navigate to="/" />

  if (characterContext.character === undefined) return <div />

  if (characterContext.character.characterType === 'unknown') return <Navigate to="/choose-character" />

  return <Outlet />
}

export default PrivateRoute
