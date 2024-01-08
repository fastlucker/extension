import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { StepperProvider } from '@common/modules/auth/contexts/stepperContext'
import DashboardScreen from '@common/modules/dashboard/screens/DashboardScreen'
import NoConnectionScreen from '@common/modules/no-connection/screens/NoConnectionScreen'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import { SignAccountOpControllerStateProvider } from '@web/contexts/signAccountOpControllerStateContext'
import { TransferControllerStateProvider } from '@web/contexts/transferControllerStateContext'
import AccountAdderScreen from '@web/modules/account-adder/screens/AccountAdderScreen'
import AccountPersonalizeScreen from '@web/modules/account-personalize/screens/AccountPersonalizeScreen'
import AccountSelectScreen from '@web/modules/account-select/screens/AccountSelectScreen'
import EmailAccountScreen from '@web/modules/auth/screens/EmailAccountScreen'
import EmailLoginScreen from '@web/modules/auth/screens/EmailLoginScreen'
import EmailRegisterScreen from '@web/modules/auth/screens/EmailRegisterScreen'
import ExternalSignerLoginScreen from '@web/modules/auth/screens/ExternalSignerLoginScreen'
import GetStartedScreen from '@web/modules/auth/screens/GetStartedScreen'
import Terms from '@web/modules/auth/screens/Terms'
import CollectibleScreen from '@web/modules/collectibles/screens/Collectible'
import CollectionScreen from '@web/modules/collectibles/screens/Collection'
import CreateNewEmailVaultScreen from '@web/modules/emailVault/screens/CreateNewEmailVaultScreen'
import HardwareWalletSelectorScreen from '@web/modules/hardware-wallet/screens/HardwareWalletSelectorScreen'
import KeyStoreSetupScreen from '@web/modules/keystore/screens/KeyStoreSetupScreen'
import KeyStoreUnlockScreen from '@web/modules/keystore/screens/KeyStoreUnlockScreen'
import DappConnectScreen from '@web/modules/notification-requests/screens/DappConnectScreen'
import GetEncryptionPublicKeyRequestScreen from '@web/modules/notification-requests/screens/GetEncryptionPublicKeyRequestScreen'
import OnBoardingScreen from '@web/modules/onboarding/screens/OnBoardingScreen'
import NavMenu from '@web/modules/router/components/NavMenu'
import PrivateRoute from '@web/modules/router/components/PrivateRoute'
import TabOnlyRoute from '@web/modules/router/components/TabOnlyRoute'
import AccountsSettingsScreen from '@web/modules/settings/screens/AccountsSettingsScreen'
import DevicePasswordSettingsScreen from '@web/modules/settings/screens/DevicePasswordSettings'
import NetworksSettingsScreen from '@web/modules/settings/screens/NetworksSettingsScreen/NetworksSettingsScreen'
import TransactionHistorySettingsScreen from '@web/modules/settings/screens/TransactionHistorySettingsScreen'
import SignAccountOpScreen from '@web/modules/sign-account-op/screens/SignAccountOpScreen'
import SignMessageScreen from '@web/modules/sign-message/screens/SignMessageScreen'
import TransferScreen from '@web/modules/transfer/screens/TransferScreen'
import ViewOnlyAccountAdderScreen from '@web/modules/view-only-account-adder/ViewOnlyAccountAdderScreen'

const stepperProvider = (
  <StepperProvider>
    <Outlet />
  </StepperProvider>
)

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={stepperProvider}>
        <Route path={WEB_ROUTES.noConnection} element={<NoConnectionScreen />} />
        <Route element={<TabOnlyRoute />}>
          <Route path={WEB_ROUTES.getStarted} element={<GetStartedScreen />} />
          <Route path={WEB_ROUTES.terms} element={<Terms />} />
          <Route path={WEB_ROUTES.keyStoreSetup} element={<KeyStoreSetupScreen />} />

          <Route path={WEB_ROUTES.authEmailAccount} element={<EmailAccountScreen />} />

          <Route path={WEB_ROUTES.createEmailVault} element={<CreateNewEmailVaultScreen />} />
          <Route path={WEB_ROUTES.authEmailLogin} element={<EmailLoginScreen />} />
          <Route path={WEB_ROUTES.authEmailRegister} element={<EmailRegisterScreen />} />

          <Route
            path={WEB_ROUTES.hardwareWalletSelect}
            element={<HardwareWalletSelectorScreen />}
          />
          <Route
            path={WEB_ROUTES.hardwareWalletSelect}
            element={<HardwareWalletSelectorScreen />}
          />
          <Route path={WEB_ROUTES.viewOnlyAccountAdder} element={<ViewOnlyAccountAdderScreen />} />

          <Route path={WEB_ROUTES.externalSigner} element={<ExternalSignerLoginScreen />} />

          <Route path={WEB_ROUTES.accountAdder} element={<AccountAdderScreen />} />
          <Route path={WEB_ROUTES.accountPersonalize} element={<AccountPersonalizeScreen />} />
          <Route path={WEB_ROUTES.onboarding} element={<OnBoardingScreen />} />

          <Route element={<PrivateRoute />}>
            <Route
              path={WEB_ROUTES.transfer}
              element={
                <TransferControllerStateProvider>
                  <TransferScreen />
                </TransferControllerStateProvider>
              }
            />
            <Route path={WEB_ROUTES.collectible} element={<CollectibleScreen />} />
            <Route path={WEB_ROUTES.accounts} element={<AccountsSettingsScreen />} />
            <Route path={WEB_ROUTES.transactions} element={<TransactionHistorySettingsScreen />} />
            <Route path={WEB_ROUTES.networks} element={<NetworksSettingsScreen />} />
            <Route path={WEB_ROUTES.devicePassword} element={<DevicePasswordSettingsScreen />} />
          </Route>
        </Route>
      </Route>

      <Route path={WEB_ROUTES.keyStoreUnlock} element={<KeyStoreUnlockScreen />} />

      <Route element={<PrivateRoute />}>
        <Route
          path={WEB_ROUTES.signAccountOp}
          element={
            <SignAccountOpControllerStateProvider>
              <SignAccountOpScreen />
            </SignAccountOpControllerStateProvider>
          }
        />
        <Route path={WEB_ROUTES.collection} element={<CollectionScreen />} />
        <Route path={WEB_ROUTES.signMessage} element={<SignMessageScreen />} />

        <Route path={WEB_ROUTES.dappConnectRequest} element={<DappConnectScreen />} />
        <Route
          path={WEB_ROUTES.getEncryptionPublicKeyRequest}
          element={<GetEncryptionPublicKeyRequestScreen />}
        />

        <Route path={WEB_ROUTES.menu} element={<NavMenu />} />
        <Route path={WEB_ROUTES.accountSelect} element={<AccountSelectScreen />} />
        <Route path={WEB_ROUTES.dashboard} element={<DashboardScreen />} />
      </Route>
    </Routes>
  )
}

export default MainRoutes
