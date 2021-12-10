// import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'

import useAccounts from '@modules/common/hooks/useAccounts'

export default function useJsonLogin() {
  const { onAddAccount } = useAccounts()

  const handleLogin = async () => {
    // TODO: add iCloud entitlement
    await DocumentPicker.getDocumentAsync()

    // TODO: validate JSON
    // const validatedFile = validateImportedAccountProps(fileContent)
    // if (validatedFile.success) onAddAccount(fileContent, { select: true })

    // const {
    //   id,
    //   salt,
    //   identityFactoryAddr,
    //   baseIdentityAddr,
    //   bytecode,
    //   signer,
    //   primaryKeyBackup,
    //   email,
    // } = identityInfo

    // onAddAccount(
    //   {
    //     id,
    //     email,
    //     primaryKeyBackup,
    //     salt,
    //     identityFactoryAddr,
    //     baseIdentityAddr,
    //     bytecode,
    //     signer,
    //   },
    //   { select: true }
    // )
  }

  return { handleLogin }
}
