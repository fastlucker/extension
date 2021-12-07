import React from 'react'

import { useAuth } from '@contexts/auth'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppsScreen from '@screens/AppsScreen'
import AuthScreen from '@screens/AuthScreen'
import DashboardScreen from '@screens/DashboardScreen'
import EarnScreen from '@screens/EarnScreen'
import SendScreen from '@screens/SendScreen'
import SettingsScreen from '@screens/SettingsScreen'
import TransactionsScreen from '@screens/TransactionsScreen'

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
