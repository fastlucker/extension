import React, { lazy, Suspense, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { Route, Routes } from 'react-router-dom'

import Alert from '@common/components/Alert'
import Spinner from '@common/components/Spinner'
import { useTranslation } from '@common/config/localization'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import flexbox from '@common/styles/utils/flexbox'
import { ControllersStateLoadedContext } from '@web/contexts/controllersStateLoadedContext'
import SortHat from '@web/modules/router/components/SortHat'

const AsyncMainRoute = lazy(() => import('@web/modules/router/components/MainRoutes'))

const Router = () => {
  const { t } = useTranslation()
  const { authStatus } = useAuth()
  const { areControllerStatesLoaded, isStatesLoadingTakingTooLong } = useContext(
    ControllersStateLoadedContext
  )

  if (isStatesLoadingTakingTooLong && !areControllerStatesLoaded) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.center]}>
        <Alert
          type="warning"
          title={t(
            'Initial loading is taking an unexpectedly long time. Could be caused by connectivity issues on your end. Or a glitch on our. If nothing else helps, please try reloading or reopening the extension.'
          )}
          style={{ maxWidth: 500 }}
        />
      </View>
    )
  }

  if (authStatus === AUTH_STATUS.LOADING || !areControllerStatesLoaded) {
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
