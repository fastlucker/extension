import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import AuthScreen from '@common/modules/auth/screens/AuthScreen'
import { headerBeta as defaultHeaderBeta } from '@common/modules/header/config/headerConfig'
import NoConnectionScreen from '@common/modules/no-connection/screens/NoConnectionScreen'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import AuthLayoutWrapper from '@web/components/AuthLayoutWrapper'
import AccountsImporterScreen from '@web/modules/accounts-importer/screens/AccountsImporterScreen'
import AddAccountPasswordToVaultScreen from '@web/modules/auth/screens/AddAccountPasswordToVaultScreen'
import EmailAccountScreen from '@web/modules/auth/screens/EmailAccountScreen'
import EmailLoginScreen from '@web/modules/auth/screens/EmailLoginScreen'
import EmailRegisterScreen from '@web/modules/auth/screens/EmailRegisterScreen'
import ExternalSignerLoginScreen from '@web/modules/auth/screens/ExternalSignerLoginScreen'
import GetStartedScreen from '@web/modules/auth/screens/GetStartedScreen'
import JsonLoginScreen from '@web/modules/auth/screens/JsonLoginScreen'
import ConnectLedgerScreen from '@web/modules/hardware-wallet/screens/ConnectLedgerScreen'
import HardwareWalletSelectorScreen from '@web/modules/hardware-wallet/screens/HardwareWalletSelectorScreen'
import RequestLedgerPermissionScreen from '@web/modules/hardware-wallet/screens/RequestLedgerPermissionScreen'
import OnBoardingScreen from '@web/modules/onboarding/screens/OnBoardingScreen'
import NavMenu from '@web/modules/router/components/NavMenu'
import PrivateRoute from '@web/modules/router/components/PrivateRoute'
import TabOnlyRoute from '@web/modules/router/components/TabOnlyRoute'

const headerBeta = (
  <>
    {defaultHeaderBeta({})}
    <Outlet />
  </>
)

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={AuthLayoutWrapper}>
        <Route path={WEB_ROUTES.noConnection} element={<NoConnectionScreen />} />
        <Route element={<TabOnlyRoute />}>
          <Route path={WEB_ROUTES.getStarted} element={<GetStartedScreen />} />
          <Route path={WEB_ROUTES.auth} element={<AuthScreen />} />

          <Route path={WEB_ROUTES.authEmailAccount} element={<EmailAccountScreen />} />

          {/* TODO: Temporarily wire-up */}
          {/* <Route path={WEB_ROUTES.ambireAccountLogin} element={<EmailLoginScreen />} /> */}
          <Route path={WEB_ROUTES.authEmailLogin} element={<EmailLoginScreen />} />
          <Route path={WEB_ROUTES.authEmailRegister} element={<EmailRegisterScreen />} />
          <Route
            path={WEB_ROUTES.ambireAccountLoginPasswordConfirm}
            element={<AddAccountPasswordToVaultScreen />}
          />

          <Route path={WEB_ROUTES.ambireAccountJsonLogin} element={<JsonLoginScreen />} />
          <Route
            path={WEB_ROUTES.ambireAccountJsonLoginPasswordConfirm}
            element={<AddAccountPasswordToVaultScreen />}
          />

          <Route
            path={WEB_ROUTES.hardwareWalletSelect}
            element={<HardwareWalletSelectorScreen />}
          />
          <Route path={WEB_ROUTES.hardwareWalletLedger} element={<ConnectLedgerScreen />} />
          <Route
            path={WEB_ROUTES.hardwareWalletLedgerPermission}
            element={<RequestLedgerPermissionScreen />}
          />
          <Route path={WEB_ROUTES.externalSigner} element={<ExternalSignerLoginScreen />} />
          <Route path={WEB_ROUTES.accountsImporter} element={<AccountsImporterScreen />} />
          <Route path={WEB_ROUTES.onboarding} element={<OnBoardingScreen />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={headerBeta}>
          <Route path={WEB_ROUTES.menu} element={<NavMenu />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default MainRoutes
