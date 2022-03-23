import { t } from 'i18next'
import Button from 'modules/common/components/Button'
import { TEXT_TYPES } from 'modules/common/components/Text'
import React, { useEffect, useState } from 'react'
import { AppState, PermissionsAndroid } from 'react-native'
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box'
import { BleErrorCode } from 'react-native-ble-plx'
import { Observable } from 'rxjs'

import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import P from '@modules/common/components/P'

const RequireLocation: React.FC<any> = ({ children }) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  // Assumes they are enabled by default and sets the flag
  // in case the `new Observable(TransportBLE.listen).subscribe` fails.
  const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean | null>(true)

  const setLocationState = () => {
    const sub = new Observable(TransportBLE.listen).subscribe({
      next: () => {
        setLocationServicesEnabled(true)
        sub.unsubscribe()
      },
      error: (e) => {
        const disabled = e?.errorCode === BleErrorCode.LocationServicesDisabled
        setLocationServicesEnabled(!disabled)
        sub.unsubscribe()
      }
    })
  }

  useEffect(() => {
    const subscription: any = AppState.addEventListener('focus', () => {
      // Called when the app state is moves from blur to focus
      setLocationState()
    })

    // Initial call
    setLocationState()

    return () => {
      if (subscription) subscription?.remove()
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const permissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )

      setPermissionGranted(permissionStatus === PermissionsAndroid.RESULTS.GRANTED)
    })()
  }, [])

  const handleOpenLocationSettings = () =>
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      enableHighAccuracy: false,
      showDialog: false,
      openLocationServices: true
    })

  if (!permissionGranted) {
    return (
      <>
        <P type={TEXT_TYPES.DANGER}>
          {t(
            'Please allow Location services first, in order to connect to hardware wallet devices.'
          )}
        </P>
        <P type={TEXT_TYPES.DANGER}>
          {t(
            'Location services are required, in order for us to pair your device through Bluetooth.'
          )}
        </P>
      </>
    )
  }

  if (!locationServicesEnabled) {
    return (
      <>
        <P type={TEXT_TYPES.DANGER}>
          {t(
            'Location services are required, in order for us to pair your device through Bluetooth.'
          )}
        </P>
        <P type={TEXT_TYPES.DANGER}>{t('Ambire does not access your location information.')}</P>
        <Button onPress={handleOpenLocationSettings} text={t('Open location settings')} />
      </>
    )
  }

  return children
}

export default RequireLocation
