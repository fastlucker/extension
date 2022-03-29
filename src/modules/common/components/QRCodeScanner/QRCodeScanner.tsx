import { BarCodeScanner } from 'expo-barcode-scanner'
import { Camera } from 'expo-camera'
import * as IntentLauncher from 'expo-intent-launcher'
import React, { useEffect, useState } from 'react'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import { APP_ID } from '@config/env'
import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import requestPermissionFlagging from '@modules/common/services/requestPermissionFlagging'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import Button from '../Button'
import styles from './styles'

interface Props {
  onScan?: (data: string) => void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
enum BASE_SIDE {
  HEIGHT = 'height',
  WIDTH = 'width'
}

const isAndroid = Platform.OS === 'android'

const QRCodeScanner = ({ onScan }: Props) => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null)
  const [scanned, setScanned] = useState<boolean>(false)
  const { t } = useTranslation()
  // Dimensions of the camera container
  const [dim, setDim] = useState<null | { width: number; height: number }>(null)
  // the camera will be stretched on that side (Android only)
  const [baseSide, setBaseSide] = useState<null | BASE_SIDE>(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await requestPermissionFlagging(Camera.requestCameraPermissionsAsync)
      setHasPermission(status === 'granted')
    })()
  }, [])

  // Android only
  useEffect(() => {
    if (dim) {
      if (dim.height / dim.width >= 16 / 9) {
        setBaseSide(BASE_SIDE.HEIGHT)
      } else {
        setBaseSide(BASE_SIDE.WIDTH)
      }
    }
  }, [dim])

  const handleBarCodeScan = ({ data }: any) => {
    setScanned(true)
    !!onScan && onScan(data)
  }

  const requestCameraPermissionAgain = async () => {
    const { status } = await requestPermissionFlagging(Camera.requestCameraPermissionsAsync)
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
    <View
      style={styles.container}
      onLayout={({
        nativeEvent: {
          layout: { width, height }
        }
      }) => {
        setDim({ width, height })
      }}
    >
      {!!hasPermission && !!baseSide && (
        <View style={StyleSheet.absoluteFillObject}>
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScan}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
            }}
            style={
              isAndroid
                ? [
                    styles.camera,
                    baseSide === BASE_SIDE.HEIGHT && { height: '100%' },
                    baseSide === BASE_SIDE.WIDTH && { width: '100%' }
                  ]
                : flexboxStyles.flex1
            }
            // Android only
            ratio="16:9"
          />
        </View>
      )}
      {hasPermission === null && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />
      )}
      {hasPermission === false && (
        <View style={spacings.mh}>
          <Text style={spacings.mbSm}>
            {t('The request for accessing the phone camera was denied.')}
          </Text>
          {Platform.OS === 'android' && (
            <Button text={t('Request camera permission')} onPress={requestCameraPermissionAgain} />
          )}
          {Platform.OS === 'ios' && (
            <Text style={spacings.mbSm}>
              {t(
                'To be able to scan the login QR code, first go to Settings. Then - select Ambire Wallet app from the list of installed apps. Finally, check alow camera access.'
              )}
            </Text>
          )}
          {Platform.OS === 'android' && (
            <Text style={spacings.mbSm}>
              {t(
                "Or if you've previously chose don't ask again - to be able to scan the login QR code, first go to Settings. Then - select Ambire Wallet app from the list of installed apps. Finally, check alow camera access."
              )}
            </Text>
          )}
          <Button text={t('Open settings')} onPress={handleGoToSettings} />
        </View>
      )}
    </View>
  )
}

export default QRCodeScanner
