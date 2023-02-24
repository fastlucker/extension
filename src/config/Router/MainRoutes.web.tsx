import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import {
  headerAlpha as defaultHeaderAlpha,
  headerBeta as defaultHeaderBeta,
  headerGamma as defaultHeaderGamma
} from '@config/Router/HeadersConfig'
import { EmailLoginProvider } from '@modules/auth/contexts/emailLoginContext'
import { JsonLoginProvider } from '@modules/auth/contexts/jsonLoginContext'
import AddAccountPasswordToVaultScreen from '@modules/auth/screens/AddAccountPasswordToVaultScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import ExternalSignerScreen from '@modules/auth/screens/ExternalSignerScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import NoConnectionScreen from '@modules/common/screens/NoConnectionScreen'
import colors from '@modules/common/styles/colors'
import CollectibleScreen from '@modules/dashboard/screens/CollectibleScreen'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import PermissionRequestScreen from '@modules/extension/screens/PermissionRequestScreen'
import SwitchNetworkRequestScreen from '@modules/extension/screens/SwitchNetworkRequestScreen'
import WatchTokenRequestScreen from '@modules/extension/screens/WatchTokenRequestScreen'
import GasInformationScreen from '@modules/gas-tank/screens/GasInformationScreen'
import GasTankScreen from '@modules/gas-tank/screens/GasTankScreen'
import HardwareWalletConnectScreen from '@modules/hardware-wallet/screens/HardwareWalletConnectScreen'
import PendingTransactionsScreen from '@modules/pending-transactions/screens/PendingTransactionsScreen'
import ProviderScreen from '@modules/receive/screens/ProviderScreen'
import ReceiveScreen from '@modules/receive/screens/ReceiveScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import SignersScreen from '@modules/settings/screens/SignersScreen'
import SignMessageScreen from '@modules/sign-message/screens/SignMessageScreen'
// import SwapScreen from '@modules/swap/screens/SwapScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import CreateNewVaultScreen from '@modules/vault/screens/CreateNewVaultScreen'
import VaultSetupGetStartedScreen from '@modules/vault/screens/VaultSetupGetStartedScreen'
import { getUiType } from '@web/utils/uiType'

import BottomNav from './BottomNav/BottomNav'
import routesConfig from './routesConfig'

const navigationEnabled = !getUiType().isNotification

const headerAlpha = (
  <>
    {navigationEnabled
      ? defaultHeaderAlpha({ backgroundColor: colors.martinique })
      : defaultHeaderBeta({})}
    <Outlet />
  </>
)

const headerBeta = (
  <>
    {defaultHeaderBeta({})}
    <Outlet />
  </>
)

const headerGamma = (
  <>
    {navigationEnabled
      ? defaultHeaderGamma({ backgroundColor: colors.martinique })
      : defaultHeaderBeta({})}
    <Outlet />
  </>
)

const emailLoginProvider = (
  <EmailLoginProvider>
    <Outlet />
  </EmailLoginProvider>
)

const jsonLoginProvider = (
  <JsonLoginProvider>
    <Outlet />
  </JsonLoginProvider>
)

const footer = (
  <>
    <Outlet />
    <BottomNav />
  </>
)

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={headerBeta}>
        <Route path={routesConfig['no-connection'].route} element={<NoConnectionScreen />} />
        <Route path={routesConfig['get-started'].route} element={<VaultSetupGetStartedScreen />} />
        <Route path={routesConfig['create-vault'].route} element={<CreateNewVaultScreen />} />
        <Route path={routesConfig.auth.route} element={<AuthScreen />} />

        <Route element={emailLoginProvider}>
          <Route path={routesConfig['ambire-account-login'].route} element={<EmailLoginScreen />} />
          <Route
            path={routesConfig['ambire-account-login-password-confirm'].route}
            element={<AddAccountPasswordToVaultScreen />}
          />
        </Route>

        <Route element={jsonLoginProvider}>
          <Route
            path={routesConfig['ambire-account-json-login'].route}
            element={<JsonLoginScreen />}
          />
          <Route
            path={routesConfig['ambire-account-json-login-password-confirm'].route}
            element={<AddAccountPasswordToVaultScreen />}
          />
        </Route>

        <Route path={routesConfig['qr-code-login'].route} element={<QRCodeLoginScreen />} />
        <Route
          path={routesConfig['hardware-wallet'].route}
          element={<HardwareWalletConnectScreen />}
        />
        <Route path={routesConfig['external-signer'].route} element={<ExternalSignerScreen />} />
      </Route>
      <Route element={headerAlpha}>
        <Route element={footer}>
          <Route path={routesConfig.dashboard.route} element={<DashboardScreen />} />
          <Route path={routesConfig.collectibles.route} element={<CollectibleScreen />} />
          <Route path={routesConfig.earn.route} element={<EarnScreen />} />
          <Route path={routesConfig.send.route} element={<SendScreen />} />
          <Route path={routesConfig.transactions.route} element={<TransactionsScreen />} />
          <Route path={routesConfig['gas-tank'].route} element={<GasTankScreen />} />
        </Route>
      </Route>
      <Route element={headerBeta}>
        <Route
          path={routesConfig['pending-transactions'].route}
          element={<PendingTransactionsScreen />}
        />
        <Route path={routesConfig.receive.route} element={<ReceiveScreen />} />
        <Route path={routesConfig.provider.route} element={<ProviderScreen />} />
        <Route path={routesConfig['sign-message'].route} element={<SignMessageScreen />} />
        <Route path={routesConfig['gas-information'].route} element={<GasInformationScreen />} />
        <Route
          path={routesConfig['permission-request'].route}
          element={<PermissionRequestScreen />}
        />
        <Route
          path={routesConfig['switch-network'].route}
          element={<SwitchNetworkRequestScreen />}
        />
        <Route path={routesConfig['watch-asset'].route} element={<WatchTokenRequestScreen />} />
      </Route>
      <Route element={headerGamma}>
        <Route path={routesConfig.signers.route} element={<SignersScreen />} />
      </Route>
    </Routes>
  )
}

export default MainRoutes
