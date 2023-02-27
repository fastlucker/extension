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
import { ROTES } from './routesConfig'

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
        <Route path={ROTES.noConnection} element={<NoConnectionScreen />} />
        <Route path={ROTES.getStarted} element={<VaultSetupGetStartedScreen />} />
        <Route path={ROTES.createVault} element={<CreateNewVaultScreen />} />
        <Route path={ROTES.auth} element={<AuthScreen />} />

        <Route element={emailLoginProvider}>
          <Route path={ROTES.ambireAccountLogin} element={<EmailLoginScreen />} />
          <Route
            path={ROTES.ambireAccountLoginPasswordConfirm}
            element={<AddAccountPasswordToVaultScreen />}
          />
        </Route>

        <Route element={jsonLoginProvider}>
          <Route path={ROTES.ambireAccountJsonLogin} element={<JsonLoginScreen />} />
          <Route
            path={ROTES.ambireAccountJsonLoginPasswordConfirm}
            element={<AddAccountPasswordToVaultScreen />}
          />
        </Route>

        <Route path={ROTES.qrCodeLogin} element={<QRCodeLoginScreen />} />
        <Route path={ROTES.hardwareWallet} element={<HardwareWalletConnectScreen />} />
        <Route path={ROTES.externalSigner} element={<ExternalSignerScreen />} />
      </Route>
      <Route element={headerAlpha}>
        <Route element={footer}>
          <Route path={ROTES.dashboard} element={<DashboardScreen />} />
          <Route path={ROTES.collectibles} element={<CollectibleScreen />} />
          <Route path={ROTES.earn} element={<EarnScreen />} />
          <Route path={ROTES.send} element={<SendScreen />} />
          <Route path={ROTES.transactions} element={<TransactionsScreen />} />
          <Route path={ROTES.gasTank} element={<GasTankScreen />} />
        </Route>
      </Route>
      <Route element={headerBeta}>
        <Route path={ROTES.menu} element={<DrawerContent />} />
        <Route path={ROTES.pendingTransactions} element={<PendingTransactionsScreen />} />
        <Route path={ROTES.receive} element={<ReceiveScreen />} />
        <Route path={ROTES.provider} element={<ProviderScreen />} />
        <Route path={ROTES.signMessage} element={<SignMessageScreen />} />
        <Route path={ROTES.gasInformation} element={<GasInformationScreen />} />
        <Route
          path={ROTES.getEncryptionPublicKeyRequest}
          element={<GetEncryptionPublicKeyRequestScreen />}
        />
        <Route path={ROTES.permissionRequest} element={<PermissionRequestScreen />} />
        <Route path={ROTES.switchNetwork} element={<SwitchNetworkRequestScreen />} />
        <Route path={ROTES.watchAsset} element={<WatchTokenRequestScreen />} />
      </Route>
      <Route element={headerGamma}>
        <Route path={ROTES.signers} element={<SignersScreen />} />
      </Route>
    </Routes>
  )
}

export default MainRoutes
