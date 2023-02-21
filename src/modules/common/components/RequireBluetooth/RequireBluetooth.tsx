import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, PermissionsAndroid, PermissionStatus, Platform, View } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import BluetoothStateManager from 'react-native-bluetooth-state-manager'

import { isAndroid } from '@config/env'
import Button from '@modules/common/components/Button'
import RequireLocation from '@modules/common/components/RequireLocation'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'

/**
 * Since Android 12 (API level 31), additional Bluetooth permissions are
 * required to connect to devices. Because of a possible bug in the Android
 * permissions library, these requests resolve to not granted (even though there
 * is no need to be granted) on Android 11 and below. So based on the Android
 * OS version (API level), we decide whether to ask for permissions or not.
 * {@link https://github.com/facebook/react-native/issues/30158}
 */
const SHOULD_ASK_FOR_EXTRA_PERMISSIONS = Platform.Version >= 31 && isAndroid

const RequireBluetooth: React.FC<any> = ({ children }) => {
  const { t } = useTranslation()
  const [androidPermissionStatus, setAndroidPermissionStatus] = useState<PermissionStatus | null>(
    SHOULD_ASK_FOR_EXTRA_PERMISSIONS ? null : PermissionsAndroid.RESULTS.GRANTED
  )
  const [isBluetoothTurningOn, setIsBluetoothTurningOn] = useState(false)
  const [isBluetoothPoweredOn, setInBluetoothPoweredOn] = useState<boolean | null>(null)

  const requestPermissions = useCallback(async () => {
    if (!SHOULD_ASK_FOR_EXTRA_PERMISSIONS) return

    const permissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    ])

    const allPermissionsGranted = Object.values(permissions).every(
      (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
    )

    const onePermissionNeverAskAgain = Object.values(permissions).some(
      (permission) => permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    )

    setAndroidPermissionStatus(
      allPermissionsGranted
        ? PermissionsAndroid.RESULTS.GRANTED
        : onePermissionNeverAskAgain
        ? PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        : PermissionsAndroid.RESULTS.DENIED
    )
  }, [])

  useEffect(() => {
    requestPermissions()
  }, [requestPermissions])

  useEffect(() => {
    const subscription = new BleManager().onStateChange((state) => {
      setInBluetoothPoweredOn(state === 'PoweredOn')

      // On state change, assume that the module is no longer in process of
      // being turned on. Delay it a bit, otherwise, there is annoying UI jump.
      setTimeout(() => setIsBluetoothTurningOn(false), 1000)
    }, true)

    return () => subscription.remove()
  }, [])

  const turnOnBluetooth = () => {
    setIsBluetoothTurningOn(true)
    BluetoothStateManager.enable()
  }

  // On Android only, location permission (ACCESS_FINE_LOCATION) also is needed.
  // This is because, on Android 11 and lower, a Bluetooth scan could
  // potentially be used to gather information about the location of the user.
  const state = isAndroid ? <RequireLocation>{children}</RequireLocation> : children

  if (isAndroid && androidPermissionStatus !== PermissionsAndroid.RESULTS.GRANTED) {
    return (
      <View style={[spacings.ph]}>
        <Text style={spacings.mbSm} fontSize={12}>
          {t(
            'Please grant permission to use Bluetooth, in order to connect to hardware wallet devices.'
          )}
        </Text>
        {androidPermissionStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ? (
          <Button onPress={Linking.openSettings} text={t('Open permission settings')} />
        ) : (
          <Button onPress={requestPermissions} text={t('Grant permission')} />
        )}
      </View>
    )
  }

  return isBluetoothPoweredOn ? (
    state
  ) : (
    <View style={[spacings.ph]}>
      <Text style={spacings.mbSm} fontSize={12}>
        {t('Please turn on Bluetooth first, in order to connect to hardware wallet devices.')}
      </Text>
      {isAndroid && (
        <Button
          disabled={isBluetoothTurningOn}
          text={isBluetoothTurningOn ? t('Turning on...') : t('Turn on Bluetooth')}
          onPress={turnOnBluetooth}
        />
      )}
    </View>
  )
}

export default RequireBluetooth
