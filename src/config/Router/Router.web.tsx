import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

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
import { SyncStorage } from '@config/storage'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import { ConnectionStates } from '@modules/common/contexts/netInfoContext'
import useAmbireExtension from '@modules/common/hooks/useAmbireExtension'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import usePasscode from '@modules/common/hooks/usePasscode'
import NoConnectionScreen from '@modules/common/screens/NoConnectionScreen'
import { navigate, navigationRef, routeNameRef } from '@modules/common/services/navigation'
import colors from '@modules/common/styles/colors'
import ConnectScreen from '@modules/connect/screens/ConnectScreen'
import CollectibleScreen from '@modules/dashboard/screens/CollectibleScreen'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import PermissionRequestScreen from '@modules/extension/screens/PermissionRequestScreen'
import SwitchNetworkRequestScreen from '@modules/extension/screens/SwitchNetworkRequestScreen'
import GasInformationScreen from '@modules/gas-tank/screens/GasInformationScreen'
import GasTankScreen from '@modules/gas-tank/screens/GasTankScreen'
import HardwareWalletConnectScreen from '@modules/hardware-wallet/screens/HardwareWalletConnectScreen'
import PendingTransactionsScreen from '@modules/pending-transactions/screens/PendingTransactionsScreen'
import ProviderScreen from '@modules/receive/screens/ProviderScreen'
import ReceiveScreen from '@modules/receive/screens/ReceiveScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import BiometricsSignScreen from '@modules/settings/screens/BiometricsSignScreen'
import ChangeAppLockingScreen from '@modules/settings/screens/ChangeAppLockingScreen'
import ChangePasscodeScreen from '@modules/settings/screens/ChangePasscodeScreen'
import SignersScreen from '@modules/settings/screens/SignersScreen'
import SignMessageScreen from '@modules/sign-message/screens/SignMessageScreen'
import SwapScreen from '@modules/swap/screens/SwapScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BACKGROUND } from '@web/constants/paths'
import { USER_INTERVENTION_METHODS } from '@web/constants/userInterventionMethods'
import { sendMessage } from '@web/services/ambexMessanger'

import { drawerWebStyle, navigationContainerDarkTheme } from './styles'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()
const MainStack = createNativeStackNavigator()
const DashboardStack = createNativeStackNavigator()
const SignersStack = createNativeStackNavigator()
const ChangePasscodeStack = createNativeStackNavigator()
const ChangeLocalAuthStack = createNativeStackNavigator()
const BiometricsStack = createNativeStackNavigator()
const AppLockingStack = createNativeStackNavigator()
const GasTankStack = createNativeStackNavigator()
const GasInformationStack = createNativeStackNavigator()

const urlSearchParams = new URLSearchParams(window?.location?.search)
const params = Object.fromEntries(urlSearchParams.entries())
const isTempExtensionPopup = !!params.route || !!params.host
const navigationEnabled = !isTempExtensionPopup

const headerAlpha = navigationEnabled ? defaultHeaderAlpha : defaultHeaderBeta
const headerBeta = navigationEnabled ? defaultHeaderBeta : defaultHeaderBeta
const headerGamma = navigationEnabled ? defaultHeaderGamma : defaultHeaderBeta

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

const ChangePasscodeStackScreen = () => {
  const { t } = useTranslation()

  return (
    <ChangePasscodeStack.Navigator screenOptions={{ header: headerBeta }}>
      <ChangePasscodeStack.Screen
        name="passcode-change-screen"
        component={ChangePasscodeScreen}
        options={{
          title: t('Passcode')
        }}
      />
    </ChangePasscodeStack.Navigator>
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

const AppLockingStackScreen = () => {
  const { t } = useTranslation()

  return (
    <AppLockingStack.Navigator screenOptions={{ header: headerBeta }}>
      <AppLockingStack.Screen
        name="app-locking-screen"
        component={ChangeAppLockingScreen}
        options={{
          title: t('Manage App Locking')
        }}
      />
    </AppLockingStack.Navigator>
  )
}

const AuthStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  // Checks whether there is a pending email login attempt. It happens when user
  // request email login and closes the extension. When the extension is opened
  // the second time - an immediate email login attempt will be triggered.
  const initialRouteName = SyncStorage.getItem('pendingLoginEmail') ? 'emailLogin' : 'auth'

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }} initialRouteName={initialRouteName}>
      <Stack.Screen options={{ title: t('Welcome') }} name="auth" component={AuthScreen} />
      <Stack.Screen
        name="emailLogin"
        options={{ title: t('Login') }}
        component={EmailLoginScreen}
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

const PermissionRequestStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator
      screenOptions={{ header: (props) => headerBeta({ ...props, backgroundColor: colors.wooed }) }}
    >
      <Stack.Screen
        options={{ title: t('Permission Request') }}
        name="permission-request"
        component={PermissionRequestScreen}
      />
    </Stack.Navigator>
  )
}
const SwitchNetworkRequestStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator
      screenOptions={{ header: (props) => headerBeta({ ...props, backgroundColor: colors.wooed }) }}
    >
      <Stack.Screen
        options={{ title: t('Switch Network Request') }}
        name="switch-network-request"
        component={SwitchNetworkRequestScreen}
      />
    </Stack.Navigator>
  )
}

const PendingTransactionsStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }}>
      <Stack.Screen
        options={{ title: t('Pending Transactions') }}
        name="pending-transactions"
        component={PendingTransactionsScreen}
      />
    </Stack.Navigator>
  )
}

const SignMessageStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }}>
      <Stack.Screen
        options={{ title: t('SignMessage') }}
        name="sign-message"
        component={SignMessageScreen}
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

  const tabsIconSize = 34

  return (
    <Tab.Navigator
      screenOptions={{
        header: headerAlpha,
        tabBarActiveTintColor: colors.heliotrope,
        tabBarInactiveTintColor: colors.titan,
        tabBarActiveBackgroundColor: colors.howl_65,
        tabBarStyle: tabBarWebStyle,
        tabBarLabelStyle,
        tabBarItemStyle: tabBarItemWebStyle
      }}
      tabBar={(props: any) =>
        !!navigationEnabled && (
          <View style={[styles.tabBarContainerWeb]}>
            <View style={[styles.backdropBlurWrapper]}>
              <View style={{ paddingBottom: props.insets.bottom }}>
                <BottomTabBar {...props} insets={{ bottom: 0 }} />
              </View>
            </View>
          </View>
        )
      }
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
      <Tab.Screen
        name="gas-tank"
        options={{
          tabBarLabel: t('Gas Tank'),
          headerTitle: t('Gas Tank'),
          tabBarIcon: ({ color }) => (
            <GasTankIcon color={color} width={tabsIconSize} height={tabsIconSize} />
          )
        }}
        component={GasTankScreen}
      />
    </Tab.Navigator>
  )
}

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={navigationEnabled ? DrawerContent : () => null}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: drawerWebStyle,
        drawerPosition: 'right'
      }}
    >
      <Drawer.Screen name="tabs" component={TabsScreens} />
    </Drawer.Navigator>
  )
}

const AppStack = () => {
  const { t } = useTranslation()
  const { isLoading } = usePasscode()

  useEffect(() => {
    if (isLoading) return

    SplashScreen.hideAsync()
  }, [isLoading])

  useEffect(() => {
    // Checks whether there is a pending email login attempt. It happens when user
    // request email login and closes the extension. When the extension is opened
    // the second time - an immediate email login attempt will be triggered.
    // Redirect the user instead of using the `initialRouteName`,
    // because when 'auth-add-account' is set for `initialRouteName`,
    // the 'drawer' route never gets rendered, and therefore - upon successful
    // login attempt - the redirection to the 'dashboard' route breaks -
    // because this route doesn't exist (it's never being rendered).
    const shouldAttemptLogin = !!SyncStorage.getItem('pendingLoginEmail')
    if (shouldAttemptLogin) {
      navigate('auth-add-account')
    }
  }, [])

  return (
    <MainStack.Navigator screenOptions={{ header: headerBeta }} initialRouteName="drawer">
      <MainStack.Screen
        name="drawer"
        component={AppDrawer}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="app-locking"
        component={AppLockingStackScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="signers"
        component={SignersStackScreen}
      />
      <MainStack.Screen
        options={{ headerShown: false }}
        name="passcode-change"
        component={ChangePasscodeStackScreen}
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
        name="permission-request"
        component={PermissionRequestStack}
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
        options={{ title: t('Sign'), headerLeft: () => null, gestureEnabled: false }}
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
  const { setParams } = useAmbireExtension()

  const handleForceClose = () => {
    if (isTempExtensionPopup && !__DEV__) {
      if (params.route === 'permission-request') {
        sendMessage(
          {
            type: 'clearPendingCallback',
            to: BACKGROUND,
            data: {
              targetHost: params.host
            }
          },
          { ignoreReply: true }
        )
      }
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleForceClose)

    return () => {
      window.removeEventListener('beforeunload', handleForceClose)
    }
  }, [])

  useEffect(() => {
    setParams(params)
  }, [setParams])

  const renderContent = useCallback(() => {
    if (connectionState === ConnectionStates.NOT_CONNECTED) {
      return <NoConnectionStack />
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return <AuthStack />
    }

    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
      if (params.route === 'permission-request') {
        return <PermissionRequestStack />
      }
      if (
        params.route === USER_INTERVENTION_METHODS.eth_sendTransaction ||
        params.route === USER_INTERVENTION_METHODS.gs_multi_send ||
        params.route === USER_INTERVENTION_METHODS.ambire_sendBatchTransaction
      ) {
        return <PendingTransactionsStack />
      }
      if (
        params.route === USER_INTERVENTION_METHODS.eth_sign ||
        params.route === USER_INTERVENTION_METHODS.personal_sign ||
        params.route === USER_INTERVENTION_METHODS.eth_signTypedData ||
        params.route === USER_INTERVENTION_METHODS.eth_signTypedData_v4
      ) {
        return <SignMessageStack />
      }
      if (params.route === USER_INTERVENTION_METHODS.wallet_switchEthereumChain) {
        return <SwitchNetworkRequestStack />
      }

      return <AppStack />
    }

    // authStatus === AUTH_STATUS.LOADING or anything else:
    return null
  }, [connectionState, authStatus])

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
