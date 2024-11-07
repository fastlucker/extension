import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import { LEGENDS_ROUTES } from '@legends/modules/router/constants'
import ErrorPage from '@legends/components/ErrorPage'
import NonV2Modal from '@legends/components/NonV2Modal'

const PrivateRoute = () => {
  const { connectedAccount, nonV2Account, allowNonV2Connection, isLoading } = useAccountContext()
  const { character, isLoading: isCharacterLoading, error: characterError } = useCharacterContext()

  if (isLoading) return null

  // If a wallet isn't connected a v2 account,redirect to the welcome screen.
  // Once a v2 account has been connected once,
  // the user should be able to access screens which will display the state of the v2 account.
  if (!connectedAccount) return <Navigate to="/" />

  if (characterError) return <ErrorPage title="Character loading error" error={characterError} />

  // Don't allow loading the Outlet component if the character is not loaded or is in the process of loading.
  if (!character || isCharacterLoading) return null

  if (character.characterType === 'unknown') return <Navigate to={LEGENDS_ROUTES.characterSelect} />

  return (
    <>
      <NonV2Modal isOpen={!allowNonV2Connection && !!nonV2Account} />
      <Outlet />
    </>
  )
}

export default PrivateRoute
