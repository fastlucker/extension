import { Account } from 'ambire-common/src/hooks/useAccounts'
import { validateImportedAccountProps } from 'ambire-common/src/services/validations'
import { Wallet } from 'ethers'
import * as DocumentPicker from 'expo-document-picker'
import React, { createContext, useCallback, useMemo, useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import { navigate } from '@modules/common/services/navigation'
import useVault from '@modules/vault/hooks/useVault'

type FormProps = {
  password?: string
}

type JsonLoginContextData = {
  handleLogin: ({ password }: FormProps) => Promise<void>
  cancelLoginAttempts: () => void
  error: string | null
  inProgress: boolean
  data: Account | null
}

const JsonLoginContext = createContext<JsonLoginContextData>({
  handleLogin: () => Promise.resolve(),
  cancelLoginAttempts: () => {},
  error: null,
  inProgress: false,
  data: null
})

const JsonLoginProvider: React.FC = ({ children }) => {
  const { t } = useTranslation()
  const [error, setError] = useState<null | string>(null)
  const [inProgress, setInProgress] = useState<boolean>(false)
  const { onAddAccount } = useAccounts()
  const [data, setData] = useState<Account | null>(null)
  const { addToast } = useToast()
  const { addToVault } = useVault()

  const handleLogin = useCallback(
    async ({ password }: { password?: string }) => {
      setError('')
      setInProgress(true)

      if (data) {
        try {
          const wallet = await Wallet.fromEncryptedJson(
            JSON.parse(data.primaryKeyBackup),
            password as string
          )

          const addr = await wallet.getAddress()

          addToVault({
            // eslint-disable-next-line no-underscore-dangle
            addr,
            item: {
              signer: wallet.privateKey,
              password,
              type: 'quickAcc'
            }
          })
            .then(() => {
              onAddAccount(data, { select: true })
            })
            .catch((e) => {
              addToast(e.message || e, { error: true })
            })
          setInProgress(false)
        } catch (e) {
          setInProgress(false)
          addToast('Invalid Account Password', { error: true })
        }
        return
      }

      const document = await DocumentPicker.getDocumentAsync({ type: 'application/json' })

      if (document.type !== 'success') {
        setInProgress(false)
        return setError(t('JSON file was not selected or something went wrong selecting it.'))
      }

      try {
        fetch(document.uri, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
          .then((response) => response.json())
          .then((fileContent) => {
            const validatedFile = validateImportedAccountProps(fileContent)
            if (!validatedFile.success) {
              setInProgress(false)
              return setError(
                validatedFile.message ||
                  t('The imported file does not contain needed account data.')
              )
            }

            setData(fileContent)
            setInProgress(false)
            navigate('addAccountPasswordToVault', { loginType: 'json' })
          })
      } catch (exception) {
        setInProgress(false)
        return setError(
          'Something went wrong with pulling the information from the JSON file selected.'
        )
      }
    },
    [addToVault, addToast, data, onAddAccount, t]
  )

  const cancelLoginAttempts = useCallback(() => {
    setData(null)
    setInProgress(false)
    setError(null)
  }, [])

  return (
    <JsonLoginContext.Provider
      value={useMemo(
        () => ({
          handleLogin,
          cancelLoginAttempts,
          error,
          inProgress,
          data
        }),
        [handleLogin, cancelLoginAttempts, error, inProgress, data]
      )}
    >
      {children}
    </JsonLoginContext.Provider>
  )
}

export { JsonLoginContext, JsonLoginProvider }
