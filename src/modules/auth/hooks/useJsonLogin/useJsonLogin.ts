import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

import useAccounts from '@modules/common/hooks/useAccounts'

export default function useJsonLogin() {
  const { onAddAccount } = useAccounts()

  const handleLogin = async () => {
    // TODO: add iCloud entitlement
    const documentResult = await DocumentPicker.getDocumentAsync()

    if (documentResult.type !== 'success') {
      // TODO: Notify user JSON file not selected.
      return
    }

    let fileContent
    try {
      fileContent = await FileSystem.readAsStringAsync(documentResult.uri)
      fileContent = JSON.parse(fileContent)
    } catch (exception) {
      // TODO: Notify user for the exception
      return
    }

    // TODO: validate JSON
    // const validatedFile = validateImportedAccountProps(fileContent)
    // if (validatedFile.success) onAddAccount(fileContent, { select: true })

    onAddAccount(fileContent, { select: true })
  }

  return { handleLogin }
}
