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
import { ConnectionStates } from '@modules/common/contexts/netInfoContext'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import useStorageController from '@modules/common/hooks/useStorageController'
import NoConnectionScreen from '@modules/common/screens/NoConnectionScreen'
import colors from '@modules/common/styles/colors'
import flexbox from '@modules/common/styles/utils/flexbox'
import ConnectScreen from '@modules/connect/screens/ConnectScreen'
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
import SwapScreen from '@modules/swap/screens/SwapScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'
import CreateNewVaultScreen from '@modules/vault/screens/CreateNewVaultScreen'
import VaultSetupGetStartedScreen from '@modules/vault/screens/VaultSetupGetStartedScreen'
import { getUiType } from '@web/utils/uiType'

import BottomNav from './BottomNav/BottomNav'

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
        <Route path="no-connection" element={<NoConnectionScreen />} />
        <Route path="get-started" element={<VaultSetupGetStartedScreen />} />
        <Route path="create-vault" element={<CreateNewVaultScreen />} />
        <Route path="auth" element={<AuthScreen />} />

        <Route element={emailLoginProvider}>
          <Route path="ambire-account-login" element={<EmailLoginScreen />} />
          <Route
            path="ambire-account-login-password-confirm"
            element={<AddAccountPasswordToVaultScreen />}
          />
        </Route>

        <Route element={jsonLoginProvider}>
          <Route path="ambire-account-json-login" element={<JsonLoginScreen />} />
          <Route
            path="ambire-account-json-login-password-confirm"
            element={<AddAccountPasswordToVaultScreen />}
          />
        </Route>

        <Route path="qr-code-login" element={<QRCodeLoginScreen />} />
        <Route path="hardware-wallet" element={<HardwareWalletConnectScreen />} />
        <Route path="external-signer" element={<ExternalSignerScreen />} />
      </Route>
      <Route element={headerAlpha}>
        <Route element={footer}>
          <Route path="dashboard" element={<DashboardScreen />} />
          <Route path="collectibles" element={<CollectibleScreen />} />
          <Route path="earn" element={<EarnScreen />} />
          <Route path="send" element={<SendScreen />} />
          <Route path="pending-transactions" element={<PendingTransactionsScreen />} />
          <Route path="transactions" element={<TransactionsScreen />} />
          <Route path="gas-tank" element={<GasTankScreen />} />
        </Route>
        <Route element={headerBeta}>
          <Route path="receive" element={<ReceiveScreen />} />
          <Route path="provider" element={<ProviderScreen />} />
          <Route path="sign-message" element={<SignMessageScreen />} />
          <Route path="gas-information" element={<GasInformationScreen />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default MainRoutes
