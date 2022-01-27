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
import { navigationRef, routeNameRef } from '@modules/common/services/navigation'
import colors from '@modules/common/styles/colors'
import DashboardScreen from '@modules/dashboard/screens/DashboardScreen'
import EarnScreen from '@modules/earn/screens/EarnScreen'
import PendingTransactionsScreen from '@modules/pending-transactions/screens/PendingTransactionsScreen'
import ReceiveScreen from '@modules/receive/screens/ReceiveScreen'
import SendScreen from '@modules/send/screens/SendScreen'
import ChangeLocalAuthScreen from '@modules/settings/screens/ChangeLocalAuthScreen'
import ChangePasscodeScreen from '@modules/settings/screens/ChangePasscodeScreen'
import PasscodeSignScreen from '@modules/settings/screens/PasscodeSignScreen'
import SettingsScreen from '@modules/settings/screens/SettingsScreen'
import ValidatePasscodeScreen from '@modules/settings/screens/ValidatePasscodeScreen'
import TransactionsScreen from '@modules/transactions/screens/TransactionsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const DashboardStack = createNativeStackNavigator()
const TransactionsStack = createNativeStackNavigator()
const EarnStack = createNativeStackNavigator()
const SendStack = createNativeStackNavigator()
const AppsStack = createNativeStackNavigator()
const SettingsStack = createNativeStackNavigator()

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

const DashboardStackScreen = () => {
  const { t } = useTranslation()

  return (
    <DashboardStack.Navigator
      screenOptions={{
        ...globalScreenOptions
      }}
    >
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
    <TransactionsStack.Navigator
      screenOptions={{
        ...globalScreenOptions
      }}
    >
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
    <EarnStack.Navigator
      screenOptions={{
        ...globalScreenOptions
      }}
    >
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
    <SendStack.Navigator
      screenOptions={{
        ...globalScreenOptions
      }}
    >
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

const AppStackScreen = () => {
  const { t } = useTranslation()

  return (
    <AppsStack.Navigator
      screenOptions={{
        ...globalScreenOptions
      }}
    >
      <AppsStack.Screen
        name="apps"
        component={AppsScreen}
        options={{
          headerTitle: t('Apps')
        }}
      />
      <AppsStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{
          headerTitle: t('Pending Transaction')
        }}
      />
    </AppsStack.Navigator>
  )
}

const SettingsStackScreen = () => {
  const { t } = useTranslation()

  return (
    <SettingsStack.Navigator
      screenOptions={{
        ...globalScreenOptions
      }}
    >
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
        name="passcode-validate"
        component={ValidatePasscodeScreen}
        options={{
          headerTitle: t('Enter passcode')
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
        name="apps-tab"
        options={{
          headerShown: false,
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

const Router = () => {
  const { isAuthenticated } = useAuth()

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
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default Router
