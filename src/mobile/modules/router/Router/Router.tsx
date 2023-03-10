import { BlurView } from 'expo-blur'
import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import DashboardIcon from '@common/assets/svg/DashboardIcon'
import EarnIcon from '@common/assets/svg/EarnIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import TransferIcon from '@common/assets/svg/TransferIcon'
import { isAndroid } from '@common/config/env'
import { TAB_BAR_BLUR } from '@common/constants/router'
import { ConnectionStates } from '@common/contexts/netInfoContext'
import useNetInfo from '@common/hooks/useNetInfo'
import useStorageController from '@common/hooks/useStorageController'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import { EmailLoginProvider } from '@common/modules/auth/contexts/emailLoginContext'
import { JsonLoginProvider } from '@common/modules/auth/contexts/jsonLoginContext'
import useAuth from '@common/modules/auth/hooks/useAuth'
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
import { headerAlpha, headerBeta, headerGamma } from '@common/modules/header/config/headerConfig'
import PendingTransactionsScreen from '@common/modules/pending-transactions/screens/PendingTransactionsScreen'
import ProviderScreen from '@common/modules/receive/screens/ProviderScreen'
import ReceiveScreen from '@common/modules/receive/screens/ReceiveScreen'
import routesConfig, { ROUTES } from '@common/modules/router/config/routesConfig'
import styles, {
  drawerStyle,
  horizontalTabBarLabelStyle,
  tabBarItemStyle,
  tabBarLabelStyle,
  tabBarStyle
} from '@common/modules/router/styles'
import SendScreen from '@common/modules/send/screens/SendScreen'
import DataDeletionPolicyScreen from '@common/modules/settings/screens/DataDeletionPolicyScreen'
import SignersScreen from '@common/modules/settings/screens/SignersScreen'
import SignMessageScreen from '@common/modules/sign-message/screens/SignMessageScreen'
import SwapScreen from '@common/modules/swap/screens/SwapScreen'
import TransactionsScreen from '@common/modules/transactions/screens/TransactionsScreen'
import { VAULT_STATUS } from '@common/modules/vault/constants/vaultStatus'
import useVault from '@common/modules/vault/hooks/useVault'
import CreateNewVaultScreen from '@common/modules/vault/screens/CreateNewVaultScreen'
import ManageVaultLockScreen from '@common/modules/vault/screens/ManageVaultLockScreen'
import ResetVaultScreen from '@common/modules/vault/screens/ResetVaultScreen'
import UnlockVaultScreen from '@common/modules/vault/screens/UnlockVaultScreen'
import VaultSetupGetStartedScreen from '@common/modules/vault/screens/VaultSetupGetStartedScreen'
import NoConnectionScreen from '@common/screens/NoConnectionScreen'
import { navigate } from '@common/services/navigation'
import colors from '@common/styles/colors'
import { IS_SCREEN_SIZE_L } from '@common/styles/spacings'
import ConnectScreen from '@mobile/modules/connect/screens/ConnectScreen'
import HardwareWalletConnectScreen from '@mobile/modules/hardware-wallet/screens/HardwareWalletConnectScreen'
import SideNavMenu from '@mobile/modules/router/components/SideNavMenu'
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()
const MainStack = createNativeStackNavigator()
const DashboardStack = createNativeStackNavigator()
const SignersStack = createNativeStackNavigator()
const ManageVaultLockStack = createNativeStackNavigator()
const EmailLoginStack = createNativeStackNavigator()
const JsonLoginStack = createNativeStackNavigator()
const GasTankStack = createNativeStackNavigator()
const GasInformationStack = createNativeStackNavigator()
const DataDeletionPolicyStack = createNativeStackNavigator()

const SignersStackScreen = () => {
  return (
    <SignersStack.Navigator screenOptions={{ header: headerGamma }}>
      <SignersStack.Screen
        name={`${ROUTES.signers}-screen`}
        component={SignersScreen}
        options={{
          title: routesConfig.signers.title
        }}
      />
    </SignersStack.Navigator>
  )
}

const DataDeletionPolicyStackScreen = () => {
  return (
    <DataDeletionPolicyStack.Navigator screenOptions={{ header: headerBeta }}>
      <DataDeletionPolicyStack.Screen
        name={`${ROUTES.dataDeletionPolicy}-screen`}
        component={DataDeletionPolicyScreen}
        options={{
          title: routesConfig['data-deletion-policy'].title
        }}
      />
    </DataDeletionPolicyStack.Navigator>
  )
}

const GasTankStackScreen = () => {
  return (
    <GasTankStack.Navigator screenOptions={{ header: headerGamma }}>
      <GasTankStack.Screen name={`${ROUTES.gasTank}-screen`} component={GasTankScreen} />
    </GasTankStack.Navigator>
  )
}

const GasInformationStackScreen = () => {
  return (
    <GasInformationStack.Navigator screenOptions={{ header: headerGamma }}>
      <GasInformationStack.Screen
        name={`${ROUTES.gasInformation}-screen`}
        component={GasInformationScreen}
      />
    </GasInformationStack.Navigator>
  )
}

const ManageVaultLockStackScreen = () => {
  return (
    <ManageVaultLockStack.Navigator screenOptions={{ header: headerBeta }}>
      <ManageVaultLockStack.Screen
        name={`${ROUTES.manageVaultLock}-screen`}
        component={ManageVaultLockScreen}
        options={{
          title: routesConfig['manage-vault-lock'].title
        }}
      />
    </ManageVaultLockStack.Navigator>
  )
}

const EmailLoginStackScreen = () => {
  return (
    <EmailLoginProvider>
      <EmailLoginStack.Navigator screenOptions={{ header: headerBeta }}>
        <EmailLoginStack.Screen
          name={`${ROUTES.ambireAccountLogin}-screen`}
          options={{ title: routesConfig['ambire-account-login'].title }}
          component={EmailLoginScreen}
        />
        <EmailLoginStack.Screen
          name={ROUTES.ambireAccountLoginPasswordConfirm}
          options={{ title: routesConfig['ambire-account-login-password-confirm'].title }}
          component={AddAccountPasswordToVaultScreen}
        />
      </EmailLoginStack.Navigator>
    </EmailLoginProvider>
  )
}

const JsonLoginStackScreen = () => {
  return (
    <JsonLoginProvider>
      <JsonLoginStack.Navigator screenOptions={{ header: headerBeta }}>
        <JsonLoginStack.Screen
          name={`${ROUTES.ambireAccountJsonLogin}-screen`}
          options={{ title: routesConfig['ambire-account-json-login'].title }}
          component={JsonLoginScreen}
        />
        <JsonLoginStack.Screen
          name={ROUTES.ambireAccountJsonLoginPasswordConfirm}
          options={{
            title: routesConfig['ambire-account-json-login-password-confirm'].title
          }}
          component={AddAccountPasswordToVaultScreen}
        />
      </JsonLoginStack.Navigator>
    </JsonLoginProvider>
  )
}

const AuthStack = () => {
  const { vaultStatus } = useVault()
  const { getItem } = useStorageController()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  const initialRouteName =
    vaultStatus === VAULT_STATUS.NOT_INITIALIZED
      ? ROUTES.getStarted
      : // Checks whether there is a pending email login attempt. It happens when user
      // request email login and closes the app. When the app is opened
      // the second time - an immediate email login attempt will be triggered.
      getItem('pendingLoginEmail')
      ? ROUTES.ambireAccountLogin
      : `${ROUTES.auth}-screen`

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }} initialRouteName={initialRouteName}>
      {vaultStatus === VAULT_STATUS.NOT_INITIALIZED && (
        <>
          <Stack.Screen
            name={ROUTES.getStarted}
            options={{ title: routesConfig['get-started'].title }}
            component={VaultSetupGetStartedScreen}
          />
          <Stack.Screen
            name={ROUTES.createVault}
            options={{ title: routesConfig['create-vault'].title }}
            component={CreateNewVaultScreen}
          />
        </>
      )}
      <Stack.Screen
        options={{ title: routesConfig.auth.title }}
        name={`${ROUTES.auth}-screen`}
        component={AuthScreen}
      />
      <Stack.Screen
        name={ROUTES.ambireAccountLogin}
        options={{ title: routesConfig['ambire-account-login'].title, headerShown: false }}
        component={EmailLoginStackScreen}
      />
      <Stack.Screen
        name={ROUTES.ambireAccountJsonLogin}
        options={{
          title: routesConfig['ambire-account-json-login'].title,
          headerShown: false
        }}
        component={JsonLoginStackScreen}
      />
      <Stack.Screen
        name={ROUTES.qrCodeLogin}
        options={{ title: routesConfig['qr-code-login'].title }}
        component={QRCodeLoginScreen}
      />
      <Stack.Screen
        name={ROUTES.hardwareWallet}
        options={{ title: routesConfig['hardware-wallet'].title }}
        component={HardwareWalletConnectScreen}
      />
      <Stack.Screen
        name={ROUTES.externalSigner}
        options={{ title: routesConfig['external-signer'].title }}
        component={ExternalSignerScreen}
      />
    </Stack.Navigator>
  )
}

const NoConnectionStack = () => {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }}>
      <Stack.Screen
        options={{ title: routesConfig['no-connection'].title }}
        name={ROUTES.noConnection}
        component={NoConnectionScreen}
      />
    </Stack.Navigator>
  )
}

const VaultStack = () => {
  const { vaultStatus, unlockVault, biometricsEnabled, resetVault } = useVault()

  useEffect(() => {
    if (vaultStatus === VAULT_STATUS.LOADING) return

    SplashScreen.hideAsync()
  }, [vaultStatus])

  if (vaultStatus === VAULT_STATUS.LOADING) return null

  const renderResetVaultScreen = useCallback<(props: any) => JSX.Element>(
    (props) => <ResetVaultScreen {...props} vaultStatus={vaultStatus} resetVault={resetVault} />,
    [resetVault, vaultStatus]
  )

  const renderUnlockVaultScreen = useCallback<(props: any) => JSX.Element>(
    (props) => (
      <UnlockVaultScreen
        {...props}
        unlockVault={unlockVault}
        vaultStatus={vaultStatus}
        biometricsEnabled={biometricsEnabled}
      />
    ),
    [biometricsEnabled, unlockVault, vaultStatus]
  )

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }} initialRouteName="unlockVault">
      <Stack.Screen
        name={ROUTES.unlockVault}
        options={{ title: routesConfig['unlock-vault'].title }}
        component={renderUnlockVaultScreen}
      />
      <Stack.Screen
        name={ROUTES.resetVault}
        options={{ title: routesConfig['reset-vault'].title }}
        component={renderResetVaultScreen}
      />
    </Stack.Navigator>
  )
}

const DashboardStackScreen = () => {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name={`${ROUTES.dashboard}-screen`} component={DashboardScreen} />
      <DashboardStack.Screen name={`${ROUTES.collectibles}-screen`} component={CollectibleScreen} />
    </DashboardStack.Navigator>
  )
}

const TabsScreens = () => {
  const tabsIconSize = IS_SCREEN_SIZE_L ? 44 : 24
  return (
    <Tab.Navigator
      screenOptions={{
        header: headerAlpha,
        tabBarActiveTintColor: colors.heliotrope,
        tabBarInactiveTintColor: colors.titan,
        tabBarActiveBackgroundColor: colors.howl_65,
        tabBarStyle,
        tabBarLabelStyle: IS_SCREEN_SIZE_L ? horizontalTabBarLabelStyle : tabBarLabelStyle,
        tabBarItemStyle
      }}
      tabBar={(props: any) => (
        <View style={[styles.tabBarContainer]}>
          <BlurView intensity={TAB_BAR_BLUR} tint="dark" style={[styles.backdropBlurWrapper]}>
            <View style={{ paddingBottom: props.insets.bottom }}>
              <BottomTabBar {...props} insets={{ bottom: 0 }} />
            </View>
          </BlurView>
        </View>
      )}
    >
      <Tab.Screen
        name={ROUTES.dashboard}
        options={{
          tabBarLabel: routesConfig.dashboard.title,
          headerTitle: routesConfig.dashboard.title,
          tabBarIcon: ({ color }) => (
            <DashboardIcon color={color} width={tabsIconSize} height={tabsIconSize} />
          )
        }}
        component={DashboardStackScreen}
      />
      {/* TODO: Temporary disabled for iOS since v1.9.2 as part of the Apple app review feedback */}
      {/* Also excluded from the bundle by including an empty EarnScreen.ios.tsx */}
      {isAndroid && (
        <Tab.Screen
          name={ROUTES.earn}
          options={{
            tabBarLabel: routesConfig.earn.title,
            headerTitle: routesConfig.earn.title,
            tabBarIcon: ({ color }) => (
              <EarnIcon color={color} width={tabsIconSize} height={tabsIconSize} />
            )
          }}
          component={EarnScreen}
        />
      )}
      <Tab.Screen
        name={ROUTES.send}
        options={{
          tabBarLabel: routesConfig.send.title,
          headerTitle: routesConfig.send.title,
          tabBarIcon: ({ color }) => (
            <SendIcon color={color} width={tabsIconSize} height={tabsIconSize} />
          )
        }}
        component={SendScreen}
      />
      <Tab.Screen
        name={ROUTES.swap}
        options={{
          tabBarLabel: routesConfig.swap.title,
          headerTitle: routesConfig.swap.title,
          tabBarIcon: ({ color }) => (
            <SwapIcon color={color} width={tabsIconSize} height={tabsIconSize} />
          )
        }}
        component={SwapScreen}
      />
      <Tab.Screen
        name={ROUTES.transactions}
        options={{
          tabBarLabel: routesConfig.transactions.title,
          headerTitle: routesConfig.transactions.title,
          tabBarIcon: ({ color }) => (
            <TransferIcon color={color} width={tabsIconSize} height={tabsIconSize} />
          )
        }}
        component={TransactionsScreen}
      />
    </Tab.Navigator>
  )
}

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={SideNavMenu}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle
      }}
    >
      <Drawer.Screen name="tabs" component={TabsScreens} />
    </Drawer.Navigator>
  )
}

const AppStack = () => {
  const { getItem } = useStorageController()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  useEffect(() => {
    // Checks whether there is a pending email login attempt. It happens when
    // user requests email login and closes the the app. When the app is opened
    // the second time - an immediate email login attempt will be triggered.
    // Redirect the user instead of using the `initialRouteName`,
    // because when '/auth' is set for `initialRouteName`,
    // the 'drawer' route never gets rendered, and therefore - upon successful
    // login attempt - the redirection to the 'dashboard' route breaks -
    // because this route doesn't exist (it's never being rendered).
    const shouldAttemptLogin = !!getItem('pendingLoginEmail')
    if (shouldAttemptLogin) {
      navigate(ROUTES.auth)
    }
  }, [getItem])

  return (
    <MainStack.Navigator screenOptions={{ header: headerBeta }}>
      <MainStack.Screen
        name="drawer"
        component={AppDrawer}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name={ROUTES.signers}
        component={SignersStackScreen}
      />
      <MainStack.Screen
        name={ROUTES.dataDeletionPolicy}
        component={DataDeletionPolicyStackScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name={ROUTES.manageVaultLock}
        component={ManageVaultLockStackScreen}
      />
      <MainStack.Screen name={ROUTES.auth} component={AuthStack} options={{ headerShown: false }} />
      {isAndroid && (
        <MainStack.Screen
          name={ROUTES.connect}
          component={ConnectScreen}
          options={{ title: routesConfig.connect.title }}
        />
      )}
      <MainStack.Screen
        name={ROUTES.receive}
        options={{ header: headerGamma }}
        component={ReceiveScreen}
      />
      <MainStack.Screen
        name={ROUTES.provider}
        options={{ title: routesConfig.receive.title }}
        component={ProviderScreen}
      />
      <MainStack.Screen
        name={ROUTES.pendingTransactions}
        component={PendingTransactionsScreen}
        options={{ title: routesConfig['pending-transactions'].title }}
      />
      <MainStack.Screen
        name={ROUTES.signMessage}
        component={SignMessageScreen}
        options={{ title: routesConfig['sign-message'].title }}
      />
      <MainStack.Screen
        name={ROUTES.gasTank}
        component={GasTankStackScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.gasInformation}
        component={GasInformationStackScreen}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  )
}

const Router = () => {
  const { authStatus } = useAuth()
  const { connectionState } = useNetInfo()
  const { vaultStatus } = useVault()

  if (connectionState === ConnectionStates.NOT_CONNECTED) {
    return <NoConnectionStack />
  }

  // Vault loads in async manner, so always wait until it's being loaded,
  // otherwise - other routes flash beforehand.
  if (vaultStatus === VAULT_STATUS.LOADING) return null

  // When locked, always prompt the user to unlock it first.
  if (VAULT_STATUS.LOCKED === vaultStatus) {
    return <VaultStack />
  }

  // When not authenticated, take him to the Auth screens first,
  // even without having a vault initialized yet.
  if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
    return <AuthStack />
  }

  if (authStatus === AUTH_STATUS.AUTHENTICATED) {
    if (VAULT_STATUS.NOT_INITIALIZED === vaultStatus) {
      return <VaultStack />
    }

    if (vaultStatus === VAULT_STATUS.UNLOCKED || vaultStatus === VAULT_STATUS.LOCKED_TEMPORARILY) {
      return <AppStack />
    }
  }

  // authStatus === AUTH_STATUS.LOADING or anything else:
  return null
}

export default Router
