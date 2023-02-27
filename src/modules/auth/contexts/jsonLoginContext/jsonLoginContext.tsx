import { Account } from 'ambire-common/src/hooks/useAccounts'
import { validateImportedAccountProps } from 'ambire-common/src/services/validations'
import { Wallet } from 'ethers'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import React, { createContext, useCallback, useMemo, useState } from 'react'
import { Keyboard } from 'react-native'

import { isWeb } from '@config/env'
import { useTranslation } from '@config/localization'
import { ROTES } from '@config/Router/routesConfig'
import useAccounts from '@modules/common/hooks/useAccounts'
import useEOA from '@modules/common/hooks/useEOA'
import useNavigation from '@modules/common/hooks/useNavigation'
import useToast from '@modules/common/hooks/useToast'
import useVault from '@modules/vault/hooks/useVault'

type FormProps = {
  password?: string
}

type JsonLoginContextData = {
  handleLogin: ({ password }: FormProps) => Promise<void>
  cancelLoginAttempts: () => void
  error: string | null
  inProgress: boolean
  pendingLoginWithQuickAccountData: Account | null
}

const JsonLoginContext = createContext<JsonLoginContextData>({
  handleLogin: () => Promise.resolve(),
  cancelLoginAttempts: () => {},
  error: null,
  inProgress: false,
  pendingLoginWithQuickAccountData: null
})

const JsonLoginProvider: React.FC<any> = ({ children }: any) => {
  const { t } = useTranslation()
  const [error, setError] = useState<null | string>(null)
  const [inProgress, setInProgress] = useState<boolean>(false)
  const { onAddAccount } = useAccounts()
  const { navigate } = useNavigation()
  const [pendingLoginWithQuickAccountData, setPendingLoginWithQuickAccountData] =
    useState<Account | null>(null)
  const { addToast } = useToast()
  const { addToVault } = useVault()
  const { onEOASelected } = useEOA()

  const handleLogin = useCallback(
    async ({ password }: { password?: string }) => {
      Keyboard.dismiss()
      setError('')
      setInProgress(true)

      if (pendingLoginWithQuickAccountData) {
        try {
          const wallet = await Wallet.fromEncryptedJson(
            JSON.parse(pendingLoginWithQuickAccountData.primaryKeyBackup),
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
              onAddAccount(pendingLoginWithQuickAccountData, { select: true })
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

      let fileContent
      try {
        if (isWeb) {
          fileContent = await fetch(document.uri, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          })
          fileContent = await fileContent.json()
        } else {
          fileContent = await FileSystem.readAsStringAsync(document.uri)
          fileContent = JSON.parse(fileContent)
        }
      } catch (exception) {
        setInProgress(false)
        return setError(
          'Something went wrong with pulling the information from the JSON file selected.'
        )
      }

      const validatedFile = validateImportedAccountProps(fileContent)
      if (!validatedFile.success) {
        setInProgress(false)
        return setError(
          validatedFile.message || t('The imported file does not contain needed account data.')
        )
      }

      const { signerExtra } = fileContent
      const accountType = signerExtra && signerExtra.type ? signerExtra.type : 'quickAcc'

      if (accountType === 'quickAcc') {
        setPendingLoginWithQuickAccountData(fileContent)
        setInProgress(false)
        return navigate(ROTES.ambireAccountJsonLoginPasswordConfirm, {
          state: {
            loginType: 'json'
          }
        })
      }

      if (accountType === 'ledger' && !isWeb) {
        return onEOASelected(fileContent.signer.address, fileContent.signerExtra)
          ?.then(() => navigate(ROTES.dashboard))
          .catch(() =>
            setError(
              t(
                'Something went wrong with importing this account from JSON. Either the JSON is invalid or there is a problem on our end. Please contact our support.'
              )
            )
          )
          .finally(() => setInProgress(false))
      }

      if (fileContent.signerExtra.type === 'Web3') {
        setInProgress(false)
        return setError(
          t(
            'This Ambire account was created using a Web3 wallet. It cannot be imported from JSON in the Ambire {{app}}. To access this account, please use the "Login with External Signer" method.',
            { app: isWeb ? t('browser extension') : t('mobile app') }
          )
        )
      }

      setInProgress(false)
      return setError(
        t(
          'Importing this account type ({{type}}) from JSON is not supported in the Ambire {{app}} at this time.',
          {
            app: isWeb ? t('brower extension') : t('mobile app'),
            type: fileContent.signerExtra.type
          }
        )
      )
    },
    [
      onEOASelected,
      addToVault,
      addToast,
      pendingLoginWithQuickAccountData,
      onAddAccount,
      t,
      navigate
    ]
  )

  const cancelLoginAttempts = useCallback(() => {
    setPendingLoginWithQuickAccountData(null)
    setInProgress(false)
    setError(null)
  }, [])

  return (
    <JsonLoginContext.Provider
      value={useMemo(
        () => ({
          handleLogin,
          error,
          inProgress,
          pendingLoginWithQuickAccountData,
          cancelLoginAttempts
        }),
        [handleLogin, cancelLoginAttempts, error, inProgress, pendingLoginWithQuickAccountData]
      )}
    >
      {children}
    </JsonLoginContext.Provider>
  )
}

export { JsonLoginContext, JsonLoginProvider }
