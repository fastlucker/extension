import { BarCodeScanner } from 'expo-barcode-scanner'
import { Camera } from 'expo-camera'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTranslation } from '@config/localization'
import P from '@modules/common/components/P'

import styles from './styles'

interface Props {
  onScan?: (data: string) => void
}

const QRCodeScanner = ({ onScan }: Props) => {
  const [hasPermission, setHasPermission] = useState<any>(null)
  const [scanned, setScanned] = useState<any>(false)
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

  return (
    <View style={styles.container}>
      {!!hasPermission && (
        <View style={StyleSheet.absoluteFillObject}>
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScan}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
            // Android only
            ratio="16:9"
            style={styles.camera}
          />
        </View>
      )}
      {hasPermission === null && <P>{t('Requesting for camera permission')}</P>}
      {hasPermission === false && <P>{t('No access to camera')}</P>}
    </View>
  )
}

export default QRCodeScanner
