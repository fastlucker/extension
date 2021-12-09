import React from 'react'

import AppsScreen from '@modules/apps/screens/AppsScreen'
import useAuth from '@modules/auth/hooks/useAuth'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import SettingsScreen from '@modules/settings/screens/SettingsScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Auth" component={AuthScreen} />
  </Stack.Navigator>
)

const AppStack = () => (
  <Tab.Navigator>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Transactions" component={TransactionsScreen} />
    <Stack.Screen name="Earn" component={EarnScreen} />
    <Stack.Screen name="Send" component={SendScreen} />
    <Stack.Screen name="Apps" component={AppsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
)

const Router = () => {
  const { token } = useAuth()
  return <NavigationContainer>{token ? <AppStack /> : <AuthStack />}</NavigationContainer>
}

export default Router
