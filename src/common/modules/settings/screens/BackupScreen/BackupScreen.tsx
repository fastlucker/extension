import { Account } from 'ambire-common/src/hooks/useAccounts'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
// import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useAccounts from '@common/hooks/useAccounts'
import spacings from '@common/styles/spacings'

async function requestStoragePermission() {
  if (Platform.OS === 'android') {
    // TODO:
    // const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    // if (status !== 'granted') {
    //   alert('Sorry, we need media library permission to save the file.');
    //   return false;
    // }
  }
  return true
}

async function exportJSON(objectToSave: Account) {
  const permission = await requestStoragePermission()

  if (!permission) {
    return
  }

  const fileName = `${objectToSave.id}.json`
  const jsonString = JSON.stringify(objectToSave, null, 2)
  const fileType = 'application/json'
  const tempUri = FileSystem.cacheDirectory + fileName

  // Write JSON to temporary file
  await FileSystem.writeAsStringAsync(tempUri, jsonString, {
    encoding: FileSystem.EncodingType.UTF8
  })

  if (Platform.OS === 'android') {
    // Move file to Download folder on Android
    const downloadFolderUri = 'file:///storage/emulated/0/Download/'
    await FileSystem.moveAsync({
      from: tempUri,
      to: downloadFolderUri + fileName
    })
    alert(`File saved to: ${downloadFolderUri}${fileName}`)
  } else {
    // Use Sharing module for iOS
    await Sharing.shareAsync(tempUri, {
      mimeType: fileType,
      dialogTitle: 'Save JSON file',
      UTI: 'public.json'
    })
  }
}

const DataDeletionPolicy = () => {
  const { t } = useTranslation()
  const { account } = useAccounts()

  const handleExport = useCallback(() => {
    exportJSON(account as Account)
  }, [account])

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Text style={spacings.mb} fontSize={20}>
          {t('Backup current account')}
        </Text>
        <Text style={spacings.mbLg}>
          {t(
            "Downloads a backup of your current account ({{accountAddress}}) encrypted with your password. It's safe to store in iCloud/Google Drive, but you cannot use it to restore your account if you forget the password. You can only import this in Ambire, it's not importable in other wallets.",
            {
              accountAddress: `${account?.id?.slice(0, 5)}...${account?.id?.slice(-3)}`
            }
          )}
        </Text>
        <Button type="primary" text={t('Download JSON backup')} onPress={handleExport} />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DataDeletionPolicy
