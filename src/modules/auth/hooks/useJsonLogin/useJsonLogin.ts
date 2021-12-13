import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import { validateImportedAccountProps } from '@modules/common/services/validate/imported-account-props'

export default function useJsonLogin() {
  const { t } = useTranslation()
  const [error, setError] = useState<null | string>(null)
  const { onAddAccount } = useAccounts()

  const handleLogin = async () => {
    setError('')

    // TODO: add iCloud entitlement
    const document = await DocumentPicker.getDocumentAsync()

    if (document.type !== 'success') {
      setError(t('JSON file was not selected or something went wrong selecting it.'))
      return
    }

    let fileContent
    try {
      fileContent = await FileSystem.readAsStringAsync(document.uri)
      fileContent = JSON.parse(fileContent)
    } catch (exception) {
      setError('Something went wrong with pulling the information from the JSON file selected.')
      return
    }

    const validatedFile = validateImportedAccountProps(fileContent)
    if (!validatedFile.success) {
      setError(
        validatedFile.message || t('The imported file does not contain needed account data.')
      )
      return
    }

    onAddAccount(fileContent, { select: true })
  }

  return { handleLogin, error }
}
