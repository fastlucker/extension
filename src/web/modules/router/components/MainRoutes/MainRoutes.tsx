import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { StepperProvider } from '@common/modules/auth/contexts/stepperContext'
import AuthScreen from '@common/modules/auth/screens/AuthScreen'
import DashboardScreen from '@common/modules/dashboard/screens/DashboardScreen'
import {
  headerControls as defaultHeaderControls,
  headerTitle as defaultHeaderTitle,
  headerTitleWithAmbireLogo as defaultHeaderTitleWithAmbireLogo
} from '@common/modules/header/config/headerConfig'
import NoConnectionScreen from '@common/modules/no-connection/screens/NoConnectionScreen'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import AuthLayoutWrapper from '@web/components/AuthLayoutWrapper'
import AccountAdderScreen from '@web/modules/account-adder/screens/AccountAdderScreen'
import AccountPersonalizeScreen from '@web/modules/account-personalize/screens/AccountPersonalizeScreen'
import AccountSelectScreen from '@web/modules/account-select/screens/AccountSelectScreen'
import AccountsScreen from '@web/modules/accounts/screens/AccountsScreen'
import PermissionRequestScreen from '@web/modules/approval-requests/screens/PermissionRequestScreen'
import AddAccountPasswordToVaultScreen from '@web/modules/auth/screens/AddAccountPasswordToVaultScreen'
import EmailAccountScreen from '@web/modules/auth/screens/EmailAccountScreen'
import EmailLoginScreen from '@web/modules/auth/screens/EmailLoginScreen'
import EmailRegisterScreen from '@web/modules/auth/screens/EmailRegisterScreen'
import ExternalSignerLoginScreen from '@web/modules/auth/screens/ExternalSignerLoginScreen'
import GetStartedScreen from '@web/modules/auth/screens/GetStartedScreen'
import JsonLoginScreen from '@web/modules/auth/screens/JsonLoginScreen'
import Terms from '@web/modules/auth/screens/Terms'
import CreateNewEmailVaultScreen from '@web/modules/emailVault/screens/CreateNewEmailVaultScreen'
import ConnectLedgerScreen from '@web/modules/hardware-wallet/screens/ConnectLedgerScreen'
import HardwareWalletSelectorScreen from '@web/modules/hardware-wallet/screens/HardwareWalletSelectorScreen'
import KeyStoreSetupScreen from '@web/modules/keystore/screens/KeyStoreSetupScreen'
import KeyStoreUnlockScreen from '@web/modules/keystore/screens/KeyStoreUnlockScreen'
import OnBoardingScreen from '@web/modules/onboarding/screens/OnBoardingScreen'
import NavMenu from '@web/modules/router/components/NavMenu'
import PrivateRoute from '@web/modules/router/components/PrivateRoute'
import TabOnlyRoute from '@web/modules/router/components/TabOnlyRoute'
import SignMessageScreen from '@web/modules/sign-message/screens/SignMessageScreen'
import TransferScreen from '@web/modules/transfer/screens/TransferScreen'

const headerControls = (
  <>
    {defaultHeaderControls({ backgroundColor: colors.zircon })}
    <Outlet />
  </>
)

const headerTitle = (
  <>
    {defaultHeaderTitle({})}
    <Outlet />
  </>
)

const headerTitleWithAmbireLogo = (
  <>
    {defaultHeaderTitleWithAmbireLogo({})}
    <Outlet />
  </>
)

const stepperProvider = (
  <StepperProvider>
    <Outlet />
  </StepperProvider>
)

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={stepperProvider}>
        <Route element={AuthLayoutWrapper}>
          <Route path={WEB_ROUTES.noConnection} element={<NoConnectionScreen />} />
          <Route element={<TabOnlyRoute />}>
            <Route path={WEB_ROUTES.getStarted} element={<GetStartedScreen />} />
            <Route path={WEB_ROUTES.terms} element={<Terms />} />
            <Route path={WEB_ROUTES.keyStoreSetup} element={<KeyStoreSetupScreen />} />
            <Route path={WEB_ROUTES.auth} element={<AuthScreen />} />

            <Route path={WEB_ROUTES.authEmailAccount} element={<EmailAccountScreen />} />

            <Route path={WEB_ROUTES.createEmailVault} element={<CreateNewEmailVaultScreen />} />
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

            <Route path={WEB_ROUTES.accounts} element={<AccountsScreen />} />
            <Route
              path={WEB_ROUTES.hardwareWalletSelect}
              element={<HardwareWalletSelectorScreen />}
            />
            <Route path={WEB_ROUTES.hardwareWalletLedger} element={<ConnectLedgerScreen />} />

            <Route path={WEB_ROUTES.externalSigner} element={<ExternalSignerLoginScreen />} />

            <Route path={WEB_ROUTES.accountAdder} element={<AccountAdderScreen />} />
            <Route path={WEB_ROUTES.accountPersonalize} element={<AccountPersonalizeScreen />} />
            <Route path={WEB_ROUTES.onboarding} element={<OnBoardingScreen />} />

            <Route path={WEB_ROUTES.transfer} element={<TransferScreen />} />
          </Route>
        </Route>

        <Route element={headerTitleWithAmbireLogo}>
          <Route path={WEB_ROUTES.keyStoreUnlock} element={<KeyStoreUnlockScreen />} />
        </Route>

        <Route element={headerTitle}>
          <Route path={WEB_ROUTES.permissionRequest} element={<PermissionRequestScreen />} />
          <Route path={WEB_ROUTES.signMessage} element={<SignMessageScreen />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={headerTitle}>
          <Route path={WEB_ROUTES.menu} element={<NavMenu />} />
          <Route path={WEB_ROUTES.accountSelect} element={<AccountSelectScreen />} />
        </Route>
        <Route element={headerControls}>
          <Route path={WEB_ROUTES.dashboard} element={<DashboardScreen />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default MainRoutes
