import * as Clipboard from 'expo-clipboard'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import useAccounts from '@common/hooks/useAccounts'
import useToast from '@common/hooks/useToast'
import alert from '@common/services/alert'

export default function useAccountBackup() {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const { addToast } = useToast()

  const exportAccountToJSON = useCallback(async () => {
    const fileName = `${account?.id || 'ambire-account-backup'}.json`
    const jsonString = JSON.stringify(account, null, 2)
    const fileType = 'application/json'
    const tempUri = FileSystem.cacheDirectory + fileName

    // Built on top of the Web Share API, which has limited browser support
    const isAvailable = await Sharing.isAvailableAsync()
    if (!isAvailable) {
      const handleCopyToClipboard = () => Clipboard.setStringAsync(jsonString)
      addToast(t('Copied to clipboard!') as string, { timeout: 2500 })

      alert(
        t('Sharing module is not available on this device.'),
        t('Account JSON backup been copied to clipboard.'),
        [
          { text: t('Copy to clipboard'), onPress: handleCopyToClipboard },
          { text: t('Cancel'), style: 'cancel' }
        ]
      )

      alert('Sharing is not available on this device. JSON data has been copied to clipboard.')
      return
    }

    // Write JSON to temporary file
    await FileSystem.writeAsStringAsync(tempUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8
    })

    // Use Sharing module for both Android and iOS
    await Sharing.shareAsync(tempUri, {
      mimeType: fileType,
      dialogTitle: 'Save JSON file',
      UTI: 'public.json'
    })
  }, [account, addToast, t])

  return { exportAccountToJSON }
}
