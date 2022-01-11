import React from 'react'
import { useTranslation } from 'react-i18next'

import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import AppsScreen from '@modules/apps/screens/AppsScreen'
import useAuth from '@modules/auth/hooks/useAuth'
import AddNewAccountScreen from '@modules/auth/screens/AddNewAccountScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import colors from '@modules/common/styles/colors'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import PendingTransactionsScreen from '@modules/pending-transactions/screens/PendingTransactionsScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import SettingsScreen from '@modules/settings/screens/SettingsScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const navigationRef: any = createNavigationContainerRef()

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const DashboardStack = createNativeStackNavigator()
const TransactionsStack = createNativeStackNavigator()
const EarnStack = createNativeStackNavigator()
const SendStack = createNativeStackNavigator()
const AppsStack = createNativeStackNavigator()
const SettingsStack = createNativeStackNavigator()

// Mechanism for being able to navigate without the navigation prop.
// {@link https://reactnavigation.org/docs/navigating-without-navigation-prop/}
export function navigate(name: string, params?: object): void {
  navigationRef.current?.navigate(name, params)
}

const DashboardStackScreen = () => {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="dashboard" component={DashboardScreen} />
      <DashboardStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </DashboardStack.Navigator>
  )
}

const TransactionsStackScreen = () => {
  return (
    <TransactionsStack.Navigator screenOptions={{ headerShown: false }}>
      <TransactionsStack.Screen name="transactions" component={TransactionsScreen} />
      <TransactionsStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </TransactionsStack.Navigator>
  )
}

const EarnStackScreen = () => {
  return (
    <EarnStack.Navigator screenOptions={{ headerShown: false }}>
      <EarnStack.Screen name="earn" component={EarnScreen} />
      <EarnStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </EarnStack.Navigator>
  )
}

const SendStackScreen = () => {
  return (
    <SendStack.Navigator screenOptions={{ headerShown: false }}>
      <SendStack.Screen name="send" component={SendScreen} />
      <SendStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </SendStack.Navigator>
  )
}

const AppStackScreen = () => {
  return (
    <AppsStack.Navigator screenOptions={{ headerShown: false }}>
      <AppsStack.Screen name="apps" component={AppsScreen} />
      <AppsStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </AppsStack.Navigator>
  )
}

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="settings" component={SettingsScreen} />
      <SettingsStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </SettingsStack.Navigator>
  )
}

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

const AuthStack = () => {
  const { t } = useTranslation()

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

const AppStack = () => {
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
        },
        ...globalScreenOptions
      }}
    >
      <Tab.Screen
        name="dashboard-tab"
        options={{
          title: t('Dashboard'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={DashboardStackScreen}
      />
      <Tab.Screen
        name="transactions-tab"
        options={{
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
        name="earn-tab"
        options={{
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
          title: t('Send'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="compare-arrows" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={SendStackScreen}
      />
      <Tab.Screen
        name="apps-tab"
        options={{
          title: t('Apps'),
          // Missing in the web app, so the icon here is mobile app specific
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-apps" size={TAB_BAR_ICON_SIZE} color={color} />
          )
        }}
        component={AppStackScreen}
      />
      <Tab.Screen
        name="settings-tab"
        options={{
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

const Router = () => {
  const { isAuthenticated } = useAuth()

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export { navigationRef }
export default Router
