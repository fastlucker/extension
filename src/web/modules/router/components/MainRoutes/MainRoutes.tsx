import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { EmailLoginProvider } from '@common/modules/auth/contexts/emailLoginContext'
import { JsonLoginProvider } from '@common/modules/auth/contexts/jsonLoginContext'
import AddAccountPasswordToVaultScreen from '@common/modules/auth/screens/AddAccountPasswordToVaultScreen'
import AuthScreen from '@common/modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@common/modules/auth/screens/EmailLoginScreen'
import ExternalSignerScreen from '@common/modules/auth/screens/ExternalSignerScreen'
import JsonLoginScreen from '@common/modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@common/modules/auth/screens/QRCodeLoginScreen'
import CollectibleScreen from '@common/modules/dashboard/screens/CollectibleScreen'
import DashboardScreen from '@common/modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@common/modules/earn/screens/EarnScreen'
import GasInformationScreen from '@common/modules/gas-tank/screens/GasInformationScreen'
import GasTankScreen from '@common/modules/gas-tank/screens/GasTankScreen'
import {
  headerAlpha as defaultHeaderAlpha,
  headerBeta as defaultHeaderBeta,
  headerGamma as defaultHeaderGamma
} from '@common/modules/header/config/headerConfig'
import NoConnectionScreen from '@common/modules/no-connection/screens/NoConnectionScreen'
import PendingTransactionsScreen from '@common/modules/pending-transactions/screens/PendingTransactionsScreen'
import ProviderScreen from '@common/modules/receive/screens/ProviderScreen'
import ReceiveScreen from '@common/modules/receive/screens/ReceiveScreen'
import { ROUTES } from '@common/modules/router/config/routesConfig'
import SendScreen from '@common/modules/send/screens/SendScreen'
import SignersScreen from '@common/modules/settings/screens/SignersScreen'
import SignMessageScreen from '@common/modules/sign-message/screens/SignMessageScreen'
import TransactionsScreen from '@common/modules/transactions/screens/TransactionsScreen'
import CreateNewVaultScreen from '@common/modules/vault/screens/CreateNewVaultScreen'
import colors from '@common/styles/colors'
import HardwareWalletConnectScreen from '@mobile/modules/hardware-wallet/screens/HardwareWalletConnectScreen'
import AuthLayoutWrapper from '@web/components/AuthLayoutWrapper'
import GetEncryptionPublicKeyRequestScreen from '@web/modules/approval-requests/screens/GetEncryptionPublicKeyRequestScreen'
import PermissionRequestScreen from '@web/modules/approval-requests/screens/PermissionRequestScreen'
import SwitchNetworkRequestScreen from '@web/modules/approval-requests/screens/SwitchNetworkRequestScreen'
import WatchTokenRequestScreen from '@web/modules/approval-requests/screens/WatchTokenRequestScreen'
import GetStartedScreen from '@web/modules/auth/screens/GetStartedScreen'
import OnBoardingScreen from '@web/modules/onboarding/screens/OnBoardingScreen'
import BottomNav from '@web/modules/router/components/BottomNav'
import NavMenu from '@web/modules/router/components/NavMenu'
import PrivateRoute from '@web/modules/router/components/PrivateRoute'
import TabOnlyRoute from '@web/modules/router/components/TabOnlyRoute'
import { getUiType } from '@web/utils/uiType'

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
      <Route element={AuthLayoutWrapper}>
        <Route path={ROUTES.noConnection} element={<NoConnectionScreen />} />
        <Route element={<TabOnlyRoute />}>
          <Route path={ROUTES.getStarted} element={<GetStartedScreen />} />
          <Route path={ROUTES.createVault} element={<CreateNewVaultScreen />} />
          <Route path={ROUTES.auth} element={<AuthScreen />} />

          <Route element={emailLoginProvider}>
            <Route path={ROUTES.ambireAccountLogin} element={<EmailLoginScreen />} />
            <Route
              path={ROUTES.ambireAccountLoginPasswordConfirm}
              element={<AddAccountPasswordToVaultScreen />}
            />
          </Route>

          <Route element={jsonLoginProvider}>
            <Route path={ROUTES.ambireAccountJsonLogin} element={<JsonLoginScreen />} />
            <Route
              path={ROUTES.ambireAccountJsonLoginPasswordConfirm}
              element={<AddAccountPasswordToVaultScreen />}
            />
          </Route>

          <Route path={ROUTES.qrCodeLogin} element={<QRCodeLoginScreen />} />
          <Route path={ROUTES.hardwareWallet} element={<HardwareWalletConnectScreen />} />
          <Route path={ROUTES.externalSigner} element={<ExternalSignerScreen />} />
          <Route path={ROUTES.onboarding} element={<OnBoardingScreen />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={headerAlpha}>
          <Route element={footer}>
            <Route path={ROUTES.dashboard} element={<DashboardScreen />} />
            <Route path={ROUTES.collectibles} element={<CollectibleScreen />} />
            <Route path={ROUTES.earn} element={<EarnScreen />} />
            <Route path={ROUTES.send} element={<SendScreen />} />
            <Route path={ROUTES.transactions} element={<TransactionsScreen />} />
            <Route path={ROUTES.gasTank} element={<GasTankScreen />} />
          </Route>
        </Route>
        <Route element={headerBeta}>
          <Route path={ROUTES.menu} element={<NavMenu />} />
          <Route path={ROUTES.pendingTransactions} element={<PendingTransactionsScreen />} />
          <Route path={ROUTES.receive} element={<ReceiveScreen />} />
          <Route path={ROUTES.provider} element={<ProviderScreen />} />
          <Route path={ROUTES.signMessage} element={<SignMessageScreen />} />
          <Route path={ROUTES.gasInformation} element={<GasInformationScreen />} />
          <Route
            path={ROUTES.getEncryptionPublicKeyRequest}
            element={<GetEncryptionPublicKeyRequestScreen />}
          />
          <Route path={ROUTES.permissionRequest} element={<PermissionRequestScreen />} />
          <Route path={ROUTES.switchNetwork} element={<SwitchNetworkRequestScreen />} />
          <Route path={ROUTES.watchAsset} element={<WatchTokenRequestScreen />} />
        </Route>
        <Route element={headerGamma}>
          <Route path={ROUTES.signers} element={<SignersScreen />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default MainRoutes
