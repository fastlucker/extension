import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { PermissionsAndroid } from 'react-native'
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box'
import { BleErrorCode } from 'react-native-ble-plx'
import { Observable } from 'rxjs'

import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import P from '@modules/common/components/P'

import Button from '../Button'

const RequireLocation: React.FC = ({ children }) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  // Assumes they are enabled by default and sets the flag
  // in case the `new Observable(TransportBLE.listen).subscribe` fails.
  const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean | null>(true)

  useEffect(() => {
    // TODO: Figure out a way to flip the `locationServicesEnabled` flag,
    // in case the location services are enabled (but they were disabled before).
    const sub = new Observable(TransportBLE.listen).subscribe({
      complete: () => {
        setLocationServicesEnabled(true)
      },
      next: () => {
        setLocationServicesEnabled(true)
      },
      error: (e) => {
        const disabled = e?.errorCode === BleErrorCode.LocationServicesDisabled
        setLocationServicesEnabled(!disabled)
      }
    })

    return () => sub.unsubscribe()
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
      <P>
        {t('Please allow Location services first, in order to connect to hardware wallet devices.')}
      </P>
    )
  }

  if (!locationServicesEnabled) {
    return (
      <>
        <P>
          {t(
            'Location services are required, in order for us to pair your device throught Bluetooth.'
          )}
        </P>
        <P>{t('Ambire does not access your location information.')}</P>
        <Button onPress={handleOpenLocationSettings} text={t('Open location settings')} />
      </>
    )
  }

  return children
}

export default RequireLocation
