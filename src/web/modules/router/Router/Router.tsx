import React, { lazy, Suspense, useContext, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Route, Routes } from 'react-router-dom'

import Spinner from '@common/components/Spinner'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import flexbox from '@common/styles/utils/flexbox'
import { ControllersStateLoadedContext } from '@web/contexts/controllersStateLoadedContext'
import useApproval from '@web/hooks/useApproval'
import SortHat from '@web/modules/router/components/SortHat'

const AsyncMainRoute = lazy(() => import('@web/modules/router/components/MainRoutes'))

const Router = () => {
  const { hasCheckedForApprovalInitially } = useApproval()
  const { path } = useRoute()
  const { navigate } = useNavigation()
  const { authStatus } = useAuth()
  const prevAuthStatus = usePrevious(authStatus)
  const isControllersStateLoaded = useContext(ControllersStateLoadedContext)

  // TODO: Figure out if this is still relevant. It breaks the flow of adding an
  // account (when there is no selected account yet), as soon as an account
  // gets selected - this clicks and redirects, which is not wanted.
  useEffect(() => {
    if (
      path !== '/' &&
      authStatus !== prevAuthStatus &&
      authStatus !== AUTH_STATUS.LOADING &&
      prevAuthStatus !== AUTH_STATUS.LOADING
    ) {
      navigate('/', { replace: true })
    }
  }, [authStatus, navigate, path, prevAuthStatus])

  if (!hasCheckedForApprovalInitially || !isControllersStateLoaded) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.center]}>
        <Spinner />
      </View>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<SortHat />} />
      </Routes>
      <Suspense fallback={null}>
        <AsyncMainRoute />
      </Suspense>
    </>
  )
}

export default Router
