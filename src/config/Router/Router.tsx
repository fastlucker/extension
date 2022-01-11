import React from 'react'

import AppsScreen from '@modules/apps/screens/AppsScreen'
import useAuth from '@modules/auth/hooks/useAuth'
import AddNewAccountScreen from '@modules/auth/screens/AddNewAccountScreen'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
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

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="auth" component={AuthScreen} />
    <Stack.Screen name="addNewAccount" component={AddNewAccountScreen} />
    <Stack.Screen name="emailLogin" component={EmailLoginScreen} />
    <Stack.Screen name="jsonLogin" component={JsonLoginScreen} />
    <Stack.Screen name="qrCodeLogin" component={QRCodeLoginScreen} />
    <Stack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
  </Stack.Navigator>
)

const DashboardStackScreen = () => {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="dashboard" component={DashboardScreen} />
      <DashboardStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </DashboardStack.Navigator>
  )
}

const TransactionsStackScreen = () => {
  return (
    <TransactionsStack.Navigator>
      <TransactionsStack.Screen name="transactions" component={TransactionsScreen} />
      <TransactionsStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </TransactionsStack.Navigator>
  )
}

const EarnStackScreen = () => {
  return (
    <EarnStack.Navigator>
      <EarnStack.Screen name="earn" component={EarnScreen} />
      <EarnStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </EarnStack.Navigator>
  )
}

const SendStackScreen = () => {
  return (
    <SendStack.Navigator>
      <SendStack.Screen name="send" component={SendScreen} />
      <SendStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </SendStack.Navigator>
  )
}

const AppStackScreen = () => {
  return (
    <AppsStack.Navigator>
      <AppsStack.Screen name="apps" component={AppsScreen} />
      <AppsStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </AppsStack.Navigator>
  )
}

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="settings" component={SettingsScreen} />
      <SettingsStack.Screen name="pending-transactions" component={PendingTransactionsScreen} />
    </SettingsStack.Navigator>
  )
}

const AppStack = () => (
  <Tab.Navigator>
    <Tab.Screen name="dashboard-tab" component={DashboardStackScreen} />
    <Tab.Screen name="transactions-tab" component={TransactionsStackScreen} />
    <Tab.Screen name="earn-tab" component={EarnStackScreen} />
    <Tab.Screen name="send-tab" component={SendStackScreen} />
    <Tab.Screen name="apps-tab" component={AppStackScreen} />
    <Tab.Screen name="settings-tab" component={SettingsStackScreen} />
  </Tab.Navigator>
)

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
