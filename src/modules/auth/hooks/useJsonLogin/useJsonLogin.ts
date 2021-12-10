import useAccounts from '@modules/common/hooks/useAccounts'

export default function useJsonLogin() {
  const { onAddAccount } = useAccounts()

  // TODO: validate
  // const validatedFile = validateImportedAccountProps(fileContent)
  // if (validatedFile.success) onAddAccount(fileContent, { select: true })

  const handleLogin = (identityInfo) => {
    const {
      id,
      salt,
      identityFactoryAddr,
      baseIdentityAddr,
      bytecode,
      signer,
      primaryKeyBackup,
      email,
    } = identityInfo

    onAddAccount(
      {
        id,
        email,
        primaryKeyBackup,
        salt,
        identityFactoryAddr,
        baseIdentityAddr,
        bytecode,
        signer,
      },
      { select: true }
    )
  }

  return { handleLogin }
}
