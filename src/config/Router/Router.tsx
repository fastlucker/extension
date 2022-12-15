import { BlurView } from 'expo-blur'
import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import DashboardIcon from '@assets/svg/DashboardIcon'
import EarnIcon from '@assets/svg/EarnIcon'
import SendIcon from '@assets/svg/SendIcon'
import SwapIcon from '@assets/svg/SwapIcon'
import TransferIcon from '@assets/svg/TransferIcon'
import { isAndroid } from '@config/env'
import DrawerContent from '@config/Router/DrawerContent'
import { headerAlpha, headerBeta, headerGamma } from '@config/Router/HeadersConfig'
import styles, {
  horizontalTabBarLabelStyle,
  tabBarItemStyle,
  tabBarLabelStyle,
  tabBarStyle
} from '@config/Router/styles'
import useAppLock from '@modules/app-lock/hooks/useAppLock'
import ManageAppLockScreen from '@modules/app-lock/screens/ManageAppLockScreen'
import SetAppLockingScreen from '@modules/app-lock/screens/SetAppLockingScreen'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import { EmailLoginProvider } from '@modules/auth/contexts/emailLoginContext'
import useAuth from '@modules/auth/hooks/useAuth'
import AddAccountPasswordToVaultScreen from '@modules/auth/screens/AddAccountPasswordToVaultScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import ExternalSignerScreen from '@modules/auth/screens/ExternalSignerScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import BiometricsSignScreen from '@modules/biometrics-sign/screens/BiometricsSignScreen'
import { TAB_BAR_BLUR } from '@modules/common/constants/router'
import { ConnectionStates } from '@modules/common/contexts/netInfoContext'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import useStorageController from '@modules/common/hooks/useStorageController'
import NoConnectionScreen from '@modules/common/screens/NoConnectionScreen'
import { navigate, navigationRef, routeNameRef } from '@modules/common/services/navigation'
import colors from '@modules/common/styles/colors'
import { IS_SCREEN_SIZE_L } from '@modules/common/styles/spacings'
import ConnectScreen from '@modules/connect/screens/ConnectScreen'
import CollectibleScreen from '@modules/dashboard/screens/CollectibleScreen'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
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
import { NavigationContainer, useIsFocused } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { drawerStyle, navigationContainerDarkTheme } from './styles'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()
const MainStack = createNativeStackNavigator()
const DashboardStack = createNativeStackNavigator()
const SignersStack = createNativeStackNavigator()
const SetAppLockStack = createNativeStackNavigator()
const BiometricsStack = createNativeStackNavigator()
const AppLockingStack = createNativeStackNavigator()
const EmailLoginStack = createNativeStackNavigator()
const GasTankStack = createNativeStackNavigator()
const GasInformationStack = createNativeStackNavigator()

const SignersStackScreen = () => {
  const { t } = useTranslation()

  return (
    <SignersStack.Navigator screenOptions={{ header: headerGamma }}>
      <SignersStack.Screen
        name="signers-screen"
        component={SignersScreen}
        options={{
          title: t('Manage Signers')
        }}
      />
    </SignersStack.Navigator>
  )
}

const GasTankStackScreen = () => {
  return (
    <GasTankStack.Navigator screenOptions={{ header: headerGamma }}>
      <GasTankStack.Screen name="gas-tank-screen" component={GasTankScreen} />
    </GasTankStack.Navigator>
  )
}

const GasInformationStackScreen = () => {
  return (
    <GasInformationStack.Navigator screenOptions={{ header: headerGamma }}>
      <GasInformationStack.Screen name="gas-information-screen" component={GasInformationScreen} />
    </GasInformationStack.Navigator>
  )
}

const SetAppLockStackScreen = () => {
  const { t } = useTranslation()

  return (
    <SetAppLockStack.Navigator screenOptions={{ header: headerBeta }}>
      <SetAppLockStack.Screen
        name="set-app-lock-screen"
        component={SetAppLockingScreen}
        options={{
          title: t('App Lock')
        }}
      />
    </SetAppLockStack.Navigator>
  )
}

const BiometricsStackScreen = () => {
  const { t } = useTranslation()

  return (
    <BiometricsStack.Navigator screenOptions={{ header: headerBeta }}>
      <BiometricsStack.Screen
        name="biometrics-sign-change-screen"
        component={BiometricsSignScreen}
        options={{
          title: t('Sign with Biometrics')
        }}
      />
    </BiometricsStack.Navigator>
  )
}

const ManageAppLockStackScreen = () => {
  const { t } = useTranslation()

  return (
    <AppLockingStack.Navigator screenOptions={{ header: headerBeta }}>
      <AppLockingStack.Screen
        name="manage-app-lock-screen"
        component={ManageAppLockScreen}
        options={{
          title: t('Manage App Lock')
        }}
      />
    </AppLockingStack.Navigator>
  )
}

const EmailLoginStackScreen = () => {
  const { t } = useTranslation()

  return (
    <EmailLoginProvider>
      <EmailLoginStack.Navigator screenOptions={{ header: headerBeta }}>
        <Stack.Screen
          name="emailLogin"
          options={{ title: t('Login') }}
          component={EmailLoginScreen}
        />
        <Stack.Screen
          name="addAccountPasswordToVault"
          options={{ title: t('Login') }}
          component={AddAccountPasswordToVaultScreen}
        />
      </EmailLoginStack.Navigator>
    </EmailLoginProvider>
  )
}

const AuthStack = () => {
  const { t } = useTranslation()
  const { vaultStatus } = useVault()
  const { getItem } = useStorageController()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  const initialRouteName =
    vaultStatus === VAULT_STATUS.NOT_INITIALIZED
      ? 'createVaultGetStarted'
      : // Checks whether there is a pending email login attempt. It happens when user
      // request email login and closes the app. When the app is opened
      // the second time - an immediate email login attempt will be triggered.
      getItem('pendingLoginEmail')
      ? 'ambireAccountLogin'
      : 'auth'

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }} initialRouteName={initialRouteName}>
      {vaultStatus === VAULT_STATUS.NOT_INITIALIZED && (
        <>
          <Stack.Screen
            name="createVaultGetStarted"
            options={{ title: t('Welcome') }}
            component={VaultSetupGetStartedScreen}
          />
          <Stack.Screen
            name="createVault"
            options={{ title: t('Setup Ambire Key Store') }}
            component={CreateNewVaultScreen}
          />
        </>
      )}
      <Stack.Screen options={{ title: t('Welcome') }} name="auth" component={AuthScreen} />
      <Stack.Screen
        name="ambireAccountLogin"
        options={{ title: t('Login'), headerShown: false }}
        component={EmailLoginStackScreen}
      />
      <Stack.Screen
        name="jsonLogin"
        options={{ title: t('Import from JSON') }}
        component={JsonLoginScreen}
      />
      <Stack.Screen
        name="qrCodeLogin"
        options={{ title: t('Import with QR Code') }}
        component={QRCodeLoginScreen}
      />
      <Stack.Screen
        name="hardwareWallet"
        options={{ title: t('Hardware Wallet') }}
        component={HardwareWalletConnectScreen}
      />
      <Stack.Screen
        name="externalSigner"
        options={{ title: t('Login with External Signer') }}
        component={ExternalSignerScreen}
      />
    </Stack.Navigator>
  )
}

const NoConnectionStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }}>
      <Stack.Screen
        options={{ title: t('No connection') }}
        name="no-connection"
        component={NoConnectionScreen}
      />
    </Stack.Navigator>
  )
}

const VaultStack = () => {
  const { t } = useTranslation()
  const { vaultStatus } = useVault()

  useEffect(() => {
    if (vaultStatus === VAULT_STATUS.LOADING) return

    SplashScreen.hideAsync()
  }, [vaultStatus])

  if (vaultStatus === VAULT_STATUS.LOADING) return null

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }} initialRouteName="unlockVault">
      <Stack.Screen
        name="unlockVault"
        options={{ title: t('Welcome Back') }}
        component={UnlockVaultScreen}
      />
      <Stack.Screen
        name="resetVault"
        options={{ title: t('Reset Ambire Key Store') }}
        component={ResetVaultScreen}
      />
    </Stack.Navigator>
  )
}

const DashboardStackScreen = () => {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="dashboard-screen" component={DashboardScreen} />
      <DashboardStack.Screen name="collectible-screen" component={CollectibleScreen} />
    </DashboardStack.Navigator>
  )
}

const TabsScreens = () => {
  const { t } = useTranslation()

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
        name="dashboard"
        options={{
          tabBarLabel: t('Dashboard'),
          headerTitle: t('Dashboard'),
          tabBarIcon: ({ color }) => (
            <DashboardIcon color={color} width={tabsIconSize} height={tabsIconSize} />
          )
        }}
        component={DashboardStackScreen}
      />
      {/* TODO: Temporary disabled for iOS since v1.9.2 as part of the Apple app review feedback */}
      {isAndroid && (
        <Tab.Screen
          name="earn"
          options={{
            tabBarLabel: t('Earn'),
            headerTitle: t('Earn'),
            tabBarIcon: ({ color }) => (
              <EarnIcon color={color} width={tabsIconSize} height={tabsIconSize} />
            )
          }}
          component={EarnScreen}
        />
      )}
      <Tab.Screen
        name="send"
        options={{
          tabBarLabel: t('Send'),
          headerTitle: t('Send'),
          tabBarIcon: ({ color }) => (
            <SendIcon color={color} width={tabsIconSize} height={tabsIconSize} />
          )
        }}
        component={SendScreen}
      />
      {/* TODO: Temporary disabled for iOS since v1.6.0 as part of the Apple app review feedback */}
      {isAndroid && (
        <Tab.Screen
          name="swap"
          options={{
            tabBarLabel: t('Swap'),
            headerTitle: t('Swap'),
            tabBarIcon: ({ color }) => (
              <SwapIcon color={color} width={tabsIconSize} height={tabsIconSize} />
            )
          }}
          component={SwapScreen}
        />
      )}
      <Tab.Screen
        name="transactions"
        options={{
          tabBarLabel: t('Transactions'),
          headerTitle: t('Transactions'),
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
      drawerContent={DrawerContent}
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
  const { t } = useTranslation()
  const { isLoading } = useAppLock()
  const { getItem } = useStorageController()

  useEffect(() => {
    if (isLoading) return

    SplashScreen.hideAsync()
  }, [isLoading])

  useEffect(() => {
    // Checks whether there is a pending email login attempt. It happens when
    // user requests email login and closes the the app. When the app is opened
    // the second time - an immediate email login attempt will be triggered.
    // Redirect the user instead of using the `initialRouteName`,
    // because when 'auth-add-account' is set for `initialRouteName`,
    // the 'drawer' route never gets rendered, and therefore - upon successful
    // login attempt - the redirection to the 'dashboard' route breaks -
    // because this route doesn't exist (it's never being rendered).
    const shouldAttemptLogin = !!getItem('pendingLoginEmail')
    if (shouldAttemptLogin) {
      navigate('auth-add-account')
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
        name="manage-app-locking"
        component={ManageAppLockStackScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="signers"
        component={SignersStackScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="set-app-lock"
        component={SetAppLockStackScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="biometrics-sign-change"
        component={BiometricsStackScreen}
      />
      <MainStack.Screen
        name="auth-add-account"
        component={AuthStack}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="connect"
        component={ConnectScreen}
        options={{ title: t('Connect a dApp') }}
      />
      <MainStack.Screen
        name="receive"
        options={{ header: headerGamma }}
        component={ReceiveScreen}
      />
      <MainStack.Screen
        name="provider"
        options={{ title: t('Receive') }}
        component={ProviderScreen}
      />
      <MainStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{ title: t('Pending Transaction') }}
      />
      <MainStack.Screen
        name="sign-message"
        component={SignMessageScreen}
        options={{ title: t('Sign') }}
      />
      <MainStack.Screen
        name="gas-tank"
        component={GasTankStackScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="gas-information"
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

  const renderContent = useCallback(() => {
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

      if (vaultStatus === VAULT_STATUS.UNLOCKED) {
        return <AppStack />
      }
    }

    // authStatus === AUTH_STATUS.LOADING or anything else:
    return null
  }, [connectionState, authStatus, vaultStatus])

  const handleOnReady = () => {
    // @ts-ignore for some reason TS complains about this 👇
    routeNameRef.current = navigationRef.current.getCurrentRoute()?.name
  }

  return (
    <NavigationContainer
      // Part of the mechanism for being able to navigate without the navigation prop.
      // For more details, see the NavigationService.
      ref={navigationRef}
      onReady={handleOnReady}
      theme={navigationContainerDarkTheme}
    >
      {renderContent()}
    </NavigationContainer>
  )
}

export default Router
