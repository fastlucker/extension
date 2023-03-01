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
import GetEncryptionPublicKeyRequestScreen from '@modules/extension/screens/GetEncryptionPublicKeyRequestScreen'
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
