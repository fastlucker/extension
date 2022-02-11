import { BarCodeScanner } from 'expo-barcode-scanner'
import { Camera } from 'expo-camera'
import * as IntentLauncher from 'expo-intent-launcher'
import React, { useEffect, useState } from 'react'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import { APP_ID } from '@config/env'
import { useTranslation } from '@config/localization'
import P from '@modules/common/components/P'

import Button from '../Button'
import styles from './styles'

interface Props {
  onScan?: (data: string) => void
}

const QRCodeScanner = ({ onScan }: Props) => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null)
  const [scanned, setScanned] = useState<boolean>(false)
  const { t } = useTranslation()

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const handleBarCodeScan = ({ data }: any) => {
    setScanned(true)
    !!onScan && onScan(data)
  }

  const requestCameraPermissionAgain = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasPermission(status === 'granted')
  }

  const handleGoToSettings = () =>
    Platform.OS === 'ios'
      ? Linking.openURL(`app-settings://camera/${APP_ID}`)
      : IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
          { data: `package:${APP_ID}` }
        )

  return (
    <View style={styles.container}>
      {!!hasPermission && (
        <View style={StyleSheet.absoluteFillObject}>
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScan}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
            }}
            // Android only
            ratio="16:9"
            style={styles.camera}
          />
        </View>
      )}
      {hasPermission === null && <P>{t('Requesting for camera permission')}</P>}
      {hasPermission === false && (
        <>
          <P>{t('The request for accessing the phone camera was denied.')}</P>
          {Platform.OS === 'android' && (
            <Button text={t('Request camera permission')} onPress={requestCameraPermissionAgain} />
          )}
          {Platform.OS === 'ios' && (
            <P>
              {t(
                'To be able to scan the login QR code, first go to Settings. Then - select Ambire Wallet app from the list of installed apps. Finally, check alow camera access.'
              )}
            </P>
          )}
          {Platform.OS === 'android' && (
            <P>
              {t(
                "Or if you've previously chose don't ask again - to be able to scan the login QR code, first go to Settings. Then - select Ambire Wallet app from the list of installed apps. Finally, check alow camera access."
              )}
            </P>
          )}
          <Button text={t('Open settings')} onPress={handleGoToSettings} />
        </>
      )}
    </View>
  )
}

export default QRCodeScanner
