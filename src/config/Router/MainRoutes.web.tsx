import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { redirect, Route, Routes } from 'react-router-native'

import DashboardIcon from '@assets/svg/DashboardIcon'
import EarnIcon from '@assets/svg/EarnIcon'
import GasTankIcon from '@assets/svg/GasTankIcon'
import SendIcon from '@assets/svg/SendIcon'
import SwapIcon from '@assets/svg/SwapIcon'
import TransferIcon from '@assets/svg/TransferIcon'
import DrawerContent from '@config/Router/DrawerContent'
import {
  headerAlpha as defaultHeaderAlpha,
  headerBeta as defaultHeaderBeta,
  headerGamma as defaultHeaderGamma
} from '@config/Router/HeadersConfig'
import styles, { tabBarItemWebStyle, tabBarLabelStyle, tabBarWebStyle } from '@config/Router/styles'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import { EmailLoginProvider } from '@modules/auth/contexts/emailLoginContext'
import { JsonLoginProvider } from '@modules/auth/contexts/jsonLoginContext'
import useAuth from '@modules/auth/hooks/useAuth'
import AddAccountPasswordToVaultScreen from '@modules/auth/screens/AddAccountPasswordToVaultScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import ExternalSignerScreen from '@modules/auth/screens/ExternalSignerScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import Spinner from '@modules/common/components/Spinner'
import { ConnectionStates } from '@modules/common/contexts/netInfoContext'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import useStorageController from '@modules/common/hooks/useStorageController'
import NoConnectionScreen from '@modules/common/screens/NoConnectionScreen'
import { navigate, navigationRef, routeNameRef } from '@modules/common/services/navigation'
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
import ResetVaultScreen from '@modules/vault/screens/ResetVaultScreen'
import UnlockVaultScreen from '@modules/vault/screens/UnlockVaultScreen'
import VaultSetupGetStartedScreen from '@modules/vault/screens/VaultSetupGetStartedScreen'
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getUiType } from '@web/utils/uiType'

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/no-connection" element={<NoConnectionScreen />} />
      <Route path="/get-started" element={<VaultSetupGetStartedScreen />} />
      <Route path="/create-vault" element={<CreateNewVaultScreen />} />
      <Route path="/auth" element={<AuthScreen />} />
      <Route path="/ambire-account-login" element={<EmailLoginScreen />} />
      <Route path="/ambire-account-json-login" element={<JsonLoginScreen />} />
      <Route path="/qr-code-login" element={<QRCodeLoginScreen />} />
      <Route path="/hardware-wallet" element={<HardwareWalletConnectScreen />} />
      <Route path="/external-signer" element={<ExternalSignerScreen />} />

      <Route path="/dashboard" element={<DashboardScreen />} />
    </Routes>
  )
}

export default MainRoutes
