import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import AddNewAccountScreen from '@modules/auth/screens/AddNewAccountScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import usePasscode from '@modules/common/hooks/usePasscode'
import { navigationRef, routeNameRef } from '@modules/common/services/navigation'
import colors from '@modules/common/styles/colors'
import ConnectScreen from '@modules/connect/screens/ConnectScreen'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import PendingTransactionsScreen from '@modules/pending-transactions/screens/PendingTransactionsScreen'
import ReceiveScreen from '@modules/receive/screens/ReceiveScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import ChangeAppLockingScreen from '@modules/settings/screens/ChangeAppLockingScreen'
import ChangeLocalAuthScreen from '@modules/settings/screens/ChangeLocalAuthScreen'
import ChangePasscodeScreen from '@modules/settings/screens/ChangePasscodeScreen'
import PasscodeSignScreen from '@modules/settings/screens/PasscodeSignScreen'
import SettingsScreen from '@modules/settings/screens/SettingsScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const DashboardStack = createNativeStackNavigator()
const TransactionsStack = createNativeStackNavigator()
const EarnStack = createNativeStackNavigator()
const SendStack = createNativeStackNavigator()
const SettingsStack = createNativeStackNavigator()

const MainStack = createNativeStackNavigator()

const globalScreenOptions = {
  headerStyle: {
    backgroundColor: colors.headerBackgroundColor,
    shadowColor: colors.headerShadowColor
  },
  headerTintColor: colors.headerTintColor,
  headerTitleStyle: {
    fontSize: 20
  },
  headerBackTitleVisible: false
}

const TAB_BAR_ICON_SIZE = 22
const HEADER_ICON_SIZE = 25

const tabsScreenOptions = ({ navigation }: any): NativeStackNavigationOptions => ({
  ...globalScreenOptions,
  headerRight: ({ tintColor }) => (
    <TouchableOpacity onPress={() => navigation.navigate('connect')}>
      <MaterialIcons name="crop-free" size={HEADER_ICON_SIZE} color={tintColor} />
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
      <Stack.Screen name="receive" options={{ title: t('Receive') }} component={ReceiveScreen} />
    </DashboardStack.Navigator>
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

const SettingsStackScreen = () => {
  const { t } = useTranslation()

  return (
    <SettingsStack.Navigator screenOptions={tabsScreenOptions}>
      <SettingsStack.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          headerTitle: t('Settings')
        }}
      />
      <SettingsStack.Screen
        name="passcode-change"
        component={ChangePasscodeScreen}
        options={{
          headerTitle: t('Passcode')
        }}
      />
      <SettingsStack.Screen
        name="local-auth-change"
        component={ChangeLocalAuthScreen}
        options={{
          headerTitle: t('Local auth')
        }}
      />
      <SettingsStack.Screen
        name="transactions-signing"
        component={PasscodeSignScreen}
        options={{
          headerTitle: t('Sign with Passcode')
        }}
      />
      <SettingsStack.Screen
        name="app-locking"
        component={ChangeAppLockingScreen}
        options={{
          headerTitle: t('App Locking')
        }}
      />
      <SettingsStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{
          headerTitle: t('Pending Transaction')
        }}
      />
    </SettingsStack.Navigator>
  )
}

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
      <Tab.Screen
        name="settings-tab"
        options={{
          headerShown: false,
          title: t('Settings'),
          // Missing in the web app, so the icon here is mobile app specific
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={SettingsStackScreen}
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
    <MainStack.Navigator
      screenOptions={{
        ...globalScreenOptions
      }}
    >
      <MainStack.Screen
        name="tabs"
        component={AppTabs}
        options={{
          headerShown: false
        }}
      />
      <MainStack.Screen
        name="connect"
        component={ConnectScreen}
        options={{ title: t('Connect a dApp') }}
      />
    </MainStack.Navigator>
  )
}

const Router = () => {
  const { authStatus } = useAuth()

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
    >
      {authStatus === AUTH_STATUS.LOADING ? null : (
        <>
          {authStatus === AUTH_STATUS.AUTHENTICATED && <AppStack />}
          {authStatus === AUTH_STATUS.NOT_AUTHENTICATED && <AuthStack />}
        </>
      )}
    </NavigationContainer>
  )
}

export default Router
