import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

import DrawerContent from '@config/Router/DrawerContent'
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import AddNewAccountScreen from '@modules/auth/screens/AddNewAccountScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import { ConnectionStates } from '@modules/common/contexts/netInfoContext'
import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import usePasscode from '@modules/common/hooks/usePasscode'
import NoConnectionScreen from '@modules/common/screens/NoConnectionScreen'
import { navigationRef, routeNameRef } from '@modules/common/services/navigation'
import colors from '@modules/common/styles/colors'
import ConnectScreen from '@modules/connect/screens/ConnectScreen'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import HardwareWalletConnectScreen from '@modules/hardware-wallet/screens/HardwareWalletConnectScreen'
import PendingTransactionsScreen from '@modules/pending-transactions/screens/PendingTransactionsScreen'
import ReceiveScreen from '@modules/receive/screens/ReceiveScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import BiometricsSignScreen from '@modules/settings/screens/BiometricsSignScreen'
import ChangeAppLockingScreen from '@modules/settings/screens/ChangeAppLockingScreen'
import ChangeLocalAuthScreen from '@modules/settings/screens/ChangeLocalAuthScreen'
import ChangePasscodeScreen from '@modules/settings/screens/ChangePasscodeScreen'
import SignersScreen from '@modules/settings/screens/SignersScreen'
import SignMessage from '@modules/sign-message/screens/SignMessage'
import SwapScreen from '@modules/swap/screens/SwapScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

const DashboardStack = createNativeStackNavigator()
const SwapStack = createNativeStackNavigator()
const TransactionsStack = createNativeStackNavigator()
const EarnStack = createNativeStackNavigator()
const SendStack = createNativeStackNavigator()
const SettingsStack = createNativeStackNavigator()

const globalScreenOptions = {
  headerStyle: {
    backgroundColor: 'transparent',
    shadowColor: colors.headerShadowColor
  },
  headerTintColor: colors.headerTintColor,
  headerTitleStyle: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.REGULAR
  },
  headerBackTitleVisible: false,
  headerTransparent: true,
  headerShadowVisible: false
}

const TAB_BAR_ICON_SIZE = 22
const HEADER_ICON_SIZE = 25

const tabsScreenOptions = ({ navigation }: any): NativeStackNavigationOptions => ({
  ...globalScreenOptions,
  headerRight: ({ tintColor }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('connect')}
      hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
    >
      <MaterialIcons name="crop-free" size={HEADER_ICON_SIZE} color={tintColor} />
    </TouchableOpacity>
  ),
  headerLeft: () => (
    <TouchableOpacity onPress={navigation.openDrawer}>
      <Ionicons name="ios-menu" size={32} color="white" />
    </TouchableOpacity>
  )
})

const DashboardStackScreen = () => {
  const { t } = useTranslation()

  return (
    <DashboardStack.Navigator screenOptions={tabsScreenOptions}>
      <DashboardStack.Screen
        name="dashboard"
        component={DashboardScreen}
        options={{
          headerTitle: t('Dashboard')
        }}
      />
      <DashboardStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{
          headerTitle: t('Pending Transaction')
        }}
      />
      <Stack.Screen options={{ title: t('Welcome') }} name="auth" component={AuthScreen} />
      <Stack.Screen
        name="addNewAccount"
        options={{ title: t('Register') }}
        component={AddNewAccountScreen}
      />
      <Stack.Screen
        name="emailLogin"
        options={{ title: t('Login') }}
        component={EmailLoginScreen}
      />
      <Stack.Screen name="jsonLogin" options={{ title: t('Login') }} component={JsonLoginScreen} />
      <Stack.Screen
        name="qrCodeLogin"
        options={{ title: t('Login') }}
        component={QRCodeLoginScreen}
      />
      <Stack.Screen
        name="hardwareWallet"
        options={{ title: t('Hardware Wallet') }}
        component={HardwareWalletConnectScreen}
      />
    </DashboardStack.Navigator>
  )
}

const SwapStackScreen = () => {
  const { t } = useTranslation()

  return (
    <SwapStack.Navigator screenOptions={tabsScreenOptions}>
      <SwapStack.Screen
        name="swap"
        component={SwapScreen}
        options={{
          headerTitle: t('Ambire Swap')
        }}
      />
      <SwapStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{
          headerTitle: t('Pending Transaction')
        }}
      />
    </SwapStack.Navigator>
  )
}

const TransactionsStackScreen = () => {
  const { t } = useTranslation()

  return (
    <TransactionsStack.Navigator screenOptions={tabsScreenOptions}>
      <TransactionsStack.Screen
        name="transactions"
        component={TransactionsScreen}
        options={{
          headerTitle: t('Transactions')
        }}
      />
      <TransactionsStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{
          headerTitle: t('Pending Transaction')
        }}
      />
    </TransactionsStack.Navigator>
  )
}

const EarnStackScreen = () => {
  const { t } = useTranslation()

  return (
    <EarnStack.Navigator screenOptions={tabsScreenOptions}>
      <EarnStack.Screen
        name="earn"
        component={EarnScreen}
        options={{
          headerTitle: t('Earn')
        }}
      />
      <EarnStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{
          headerTitle: t('Pending Transaction')
        }}
      />
    </EarnStack.Navigator>
  )
}

const SendStackScreen = () => {
  const { t } = useTranslation()

  return (
    <SendStack.Navigator screenOptions={tabsScreenOptions}>
      <SendStack.Screen
        name="send"
        component={SendScreen}
        options={{
          headerTitle: t('Send')
        }}
      />
      <SendStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{
          headerTitle: t('Pending Transaction')
        }}
      />
    </SendStack.Navigator>
  )
}

// const DAppsStackScreen = () => {
// TODO: DApps: postponed for version 2 of the mobile app
// }

const AuthStack = () => {
  const { t } = useTranslation()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen options={{ title: t('Welcome') }} name="auth" component={AuthScreen} />
      <Stack.Screen
        name="addNewAccount"
        options={{ title: t('Register') }}
        component={AddNewAccountScreen}
      />
      <Stack.Screen
        name="emailLogin"
        options={{ title: t('Login') }}
        component={EmailLoginScreen}
      />
      <Stack.Screen name="jsonLogin" options={{ title: t('Login') }} component={JsonLoginScreen} />
      <Stack.Screen
        name="qrCodeLogin"
        options={{ title: t('Login') }}
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
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen
        options={{ title: t('No connection') }}
        name="no-connection"
        component={NoConnectionScreen}
      />
    </Stack.Navigator>
  )
}

const AppTabs = () => {
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActiveTintColor,
        tabBarInactiveTintColor: colors.tabBarInactiveTintColor,
        tabBarInactiveBackgroundColor: colors.tabBarInactiveBackgroundColor,
        tabBarActiveBackgroundColor: colors.tabBarActiveBackgroundColor,
        tabBarStyle: {
          backgroundColor: colors.tabBarInactiveBackgroundColor,
          borderTopColor: colors.headerShadowColor
        },
        tabBarLabelStyle: {
          paddingBottom: 5
        }
      }}
    >
      <Tab.Screen
        name="dashboard-tab"
        options={{
          headerShown: false,
          title: t('Dashboard'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={DashboardStackScreen}
      />
      <Tab.Screen
        name="earn-tab"
        options={{
          headerShown: false,
          title: t('Earn'),
          tabBarIcon: ({ color }) => (
            // Use this one, because the actual one is <BsPiggyBank />,
            // but the Bootstrap Icons set is not available
            <MaterialIcons name="attach-money" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={EarnStackScreen}
      />
      <Tab.Screen
        name="send-tab"
        options={{
          headerShown: false,
          title: t('Send'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="compare-arrows" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={SendStackScreen}
      />
      <Tab.Screen
        name="swap-tab"
        options={{
          headerShown: false,
          title: t('Swap'),
          // Use this one, because the actual one is <BiTransfer />,
          // but the Box Icons set is not available
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="retweet" size={TAB_BAR_ICON_SIZE - 4} color={color} />
          )
        }}
        component={SwapStackScreen}
      />
      <Tab.Screen
        name="transactions-tab"
        options={{
          headerShown: false,
          title: t('Transactions'),
          // Use this one, because the actual one is <BiTransfer />,
          // but the Box Icons set is not available
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="send-and-archive" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={TransactionsStackScreen}
      />
    </Tab.Navigator>
  )
}

const AppStack = () => {
  const { t } = useTranslation()
  const { isLoading } = usePasscode()

  useEffect(() => {
    if (isLoading) return

    SplashScreen.hideAsync()
  }, [isLoading])

  return (
    <Drawer.Navigator drawerContent={DrawerContent} screenOptions={globalScreenOptions}>
      <Drawer.Screen
        name="tabs"
        component={AppTabs}
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen name="receive" options={{ title: t('Receive') }} component={ReceiveScreen} />
      <Drawer.Screen
        name="passcode-change"
        component={ChangePasscodeScreen}
        options={{
          headerTitle: t('Passcode')
        }}
      />
      <Drawer.Screen
        name="local-auth-change"
        component={ChangeLocalAuthScreen}
        options={{
          headerTitle: t('Local auth')
        }}
      />
      <Drawer.Screen
        name="biometrics-sign-change"
        component={BiometricsSignScreen}
        options={{
          headerTitle: t('Sign with Biometrics')
        }}
      />
      <Drawer.Screen
        name="app-locking"
        component={ChangeAppLockingScreen}
        options={{
          headerTitle: t('App Locking')
        }}
      />
      <Drawer.Screen
        name="signers"
        component={SignersScreen}
        options={{
          headerTitle: t('Manage signers')
        }}
      />
      {/* TODO: Is this needed? Probably no. */}
      {/* <Drawer.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{
          headerTitle: t('Pending Transaction')
        }}
      /> */}
      <Drawer.Screen
        name="connect"
        component={ConnectScreen}
        options={{ title: t('Connect a dApp') }}
      />
      <Drawer.Screen name="sign-message" component={SignMessage} options={{ title: t('Sign') }} />
    </Drawer.Navigator>
  )
}

const Router = () => {
  const { authStatus } = useAuth()
  const { connectionState } = useNetInfo()

  const renderContent = useCallback(() => {
    if (connectionState === ConnectionStates.NOT_CONNECTED) {
      return <NoConnectionStack />
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return <AuthStack />
    }

    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
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
      theme={{
        dark: true,
        colors: {
          primary: colors.panelBackgroundColor,
          background: 'transparent',
          card: colors.panelBackgroundColor,
          text: colors.textColor,
          border: 'transparent',
          notification: colors.panelBackgroundColor
        }
      }}
    >
      {renderContent()}
    </NavigationContainer>
  )
}

export default Router
