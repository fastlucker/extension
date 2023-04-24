import * as Clipboard from 'expo-clipboard'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { isAndroid } from '@common/config/env'
import i18n from '@common/config/localization/localization'
import useAccounts from '@common/hooks/useAccounts'
import useToast from '@common/hooks/useToast'
import alert from '@common/services/alert'
import spacings from '@common/styles/spacings'

const DataDeletionPolicy = () => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const { addToast } = useToast()

  const handleExport = useCallback(async () => {
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
        i18n.t('Sharing module is not available on this device.'),
        i18n.t('Account JSON backup been copied to clipboard.'),
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

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Text style={spacings.mb} fontSize={20}>
          {t('Backup current account')}
        </Text>
        <Text style={spacings.mbLg}>
          {t(
            "{{action}} a backup of your current account ({{accountAddress}}) encrypted with your password. It's safe to store in iCloud/Google Drive, but you cannot use it to restore your account if you forget the password. You can only import this in Ambire, it's not importable in other wallets.",
            {
              accountAddress: `${account?.id?.slice(0, 5)}...${account?.id?.slice(-3)}`,
              action: isAndroid ? t('Export') : t('Download')
            }
          )}
        </Text>
        <Button
          type="primary"
          text={t('{{action}} JSON backup', { action: isAndroid ? t('Export') : t('Download') })}
          onPress={handleExport}
        />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DataDeletionPolicy
