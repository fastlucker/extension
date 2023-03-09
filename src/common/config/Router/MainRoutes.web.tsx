import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import {
  headerAlpha as defaultHeaderAlpha,
  headerBeta as defaultHeaderBeta,
  headerGamma as defaultHeaderGamma
} from '@common/config/Router/HeadersConfig'
import NoConnectionScreen from '@common/screens/NoConnectionScreen'
import colors from '@common/styles/colors'
import { EmailLoginProvider } from '@mobile/auth/contexts/emailLoginContext'
import { JsonLoginProvider } from '@mobile/auth/contexts/jsonLoginContext'
import AddAccountPasswordToVaultScreen from '@mobile/auth/screens/AddAccountPasswordToVaultScreen'
import AuthScreen from '@mobile/auth/screens/AuthScreen'
import EmailLoginScreen from '@mobile/auth/screens/EmailLoginScreen'
import ExternalSignerScreen from '@mobile/auth/screens/ExternalSignerScreen'
import JsonLoginScreen from '@mobile/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@mobile/auth/screens/QRCodeLoginScreen'
import CollectibleScreen from '@mobile/dashboard/screens/CollectibleScreen'
import DashboardScreen from '@mobile/dashboard/screens/DashboardScreen'
import EarnScreen from '@mobile/earn/screens/EarnScreen'
import GetEncryptionPublicKeyRequestScreen from '@mobile/extension/screens/GetEncryptionPublicKeyRequestScreen'
import PermissionRequestScreen from '@mobile/extension/screens/PermissionRequestScreen'
import SwitchNetworkRequestScreen from '@mobile/extension/screens/SwitchNetworkRequestScreen'
import WatchTokenRequestScreen from '@mobile/extension/screens/WatchTokenRequestScreen'
import GasInformationScreen from '@mobile/gas-tank/screens/GasInformationScreen'
import GasTankScreen from '@mobile/gas-tank/screens/GasTankScreen'
import HardwareWalletConnectScreen from '@mobile/hardware-wallet/screens/HardwareWalletConnectScreen'
import OnBoardingScreen from '@mobile/onboarding/screens/OnBoardingScreen'
import PendingTransactionsScreen from '@mobile/pending-transactions/screens/PendingTransactionsScreen'
import ProviderScreen from '@mobile/receive/screens/ProviderScreen'
import ReceiveScreen from '@mobile/receive/screens/ReceiveScreen'
import SendScreen from '@mobile/send/screens/SendScreen'
import SignersScreen from '@mobile/settings/screens/SignersScreen'
import SignMessageScreen from '@mobile/sign-message/screens/SignMessageScreen'
// import SwapScreen from '@mobile/swap/screens/SwapScreen'
import TransactionsScreen from '@mobile/transactions/screens/TransactionsScreen'
import CreateNewVaultScreen from '@mobile/vault/screens/CreateNewVaultScreen'
import VaultSetupGetStartedScreen from '@mobile/vault/screens/VaultSetupGetStartedScreen'
import { getUiType } from '@web/utils/uiType'

import BottomNav from './BottomNav/BottomNav'
import DrawerContent from './DrawerContent/DrawerContent.web'
import PrivateRoute from './PrivateRoute'
import { ROUTES } from './routesConfig'
import TabOnlyRoute from './TabOnlyRoute'

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
        <Route path={ROUTES.noConnection} element={<NoConnectionScreen />} />
        <Route element={<TabOnlyRoute />}>
          <Route path={ROUTES.getStarted} element={<VaultSetupGetStartedScreen />} />
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
          <Route path={ROUTES.menu} element={<DrawerContent />} />
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
