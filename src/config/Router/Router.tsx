import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import DrawerContent from '@config/Router/DrawerContent'
import { headerBeta, headerGamma } from '@config/Router/HeadersConfig'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import AuthScreen from '@modules/auth/screens/AuthScreen'
import EmailLoginScreen from '@modules/auth/screens/EmailLoginScreen'
import JsonLoginScreen from '@modules/auth/screens/JsonLoginScreen'
import QRCodeLoginScreen from '@modules/auth/screens/QRCodeLoginScreen'
import { ConnectionStates } from '@modules/common/contexts/netInfoContext'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import usePasscode from '@modules/common/hooks/usePasscode'
import NoConnectionScreen from '@modules/common/screens/NoConnectionScreen'
import { navigationRef, routeNameRef } from '@modules/common/services/navigation'
import ConnectScreen from '@modules/connect/screens/ConnectScreen'
import HardwareWalletConnectScreen from '@modules/hardware-wallet/screens/HardwareWalletConnectScreen'
import PendingTransactionsScreen from '@modules/pending-transactions/screens/PendingTransactionsScreen'
import ReceiveScreen from '@modules/receive/screens/ReceiveScreen'
import BiometricsSignScreen from '@modules/settings/screens/BiometricsSignScreen'
import ChangeAppLockingScreen from '@modules/settings/screens/ChangeAppLockingScreen'
import ChangeLocalAuthScreen from '@modules/settings/screens/ChangeLocalAuthScreen'
import ChangePasscodeScreen from '@modules/settings/screens/ChangePasscodeScreen'
import SignersScreen from '@modules/settings/screens/SignersScreen'
import SignMessage from '@modules/sign-message/screens/SignMessage'
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { drawerStyle, navigationContainerDarkTheme } from './styles'
import TabsScreens from './TabsScreens'

const Stack = createNativeStackNavigator()

const Drawer = createDrawerNavigator()

const MainStack = createNativeStackNavigator()
const SignersStack = createNativeStackNavigator()
const ChangePasscodeStack = createNativeStackNavigator()
const ChangeLocalAuthStack = createNativeStackNavigator()
const BiometricsStack = createNativeStackNavigator()
const AppLockingStack = createNativeStackNavigator()

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

const ChangeLocalAuthStackScreen = () => {
  const { t } = useTranslation()

  return (
    <ChangeLocalAuthStack.Navigator screenOptions={{ header: headerBeta }}>
      <ChangeLocalAuthStack.Screen
        name="local-auth-change-screen"
        component={ChangeLocalAuthScreen}
        options={{
          title: t('Local Auth')
        }}
      />
    </ChangeLocalAuthStack.Navigator>
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

  return (
    <Stack.Navigator screenOptions={{ header: headerBeta }}>
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

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={DrawerContent}
      screenOptions={(): DrawerNavigationOptions => ({
        headerShown: false,
        drawerType: 'front',
        drawerStyle
      })}
    >
      <Drawer.Screen name="tabs" component={TabsScreens} />
      <Drawer.Screen name="passcode-change" component={ChangePasscodeStackScreen} />
      <Drawer.Screen name="local-auth-change" component={ChangeLocalAuthStackScreen} />
      <Drawer.Screen name="biometrics-sign-change" component={BiometricsStackScreen} />
      <Drawer.Screen name="app-locking" component={AppLockingStackScreen} />
      <Drawer.Screen name="signers" component={SignersStackScreen} />
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
        options={{ title: t('Receive') }}
        component={ReceiveScreen}
      />
      <MainStack.Screen
        name="pending-transactions"
        component={PendingTransactionsScreen}
        options={{ title: t('Pending Transaction') }}
      />
      <MainStack.Screen
        name="sign-message"
        component={SignMessage}
        options={{ title: t('Sign') }}
      />
    </MainStack.Navigator>
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
      theme={navigationContainerDarkTheme}
    >
      {renderContent()}
    </NavigationContainer>
  )
}

export default Router
