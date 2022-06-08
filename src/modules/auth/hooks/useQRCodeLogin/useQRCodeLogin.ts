import { validateImportedAccountProps } from 'ambire-common/src/services/validations'
import { useState } from 'react'

import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'

export default function useQRCodeLogin() {
  const { t } = useTranslation()
  const [error, setError] = useState<null | string>(null)
  const [inProgress, setInProgress] = useState<boolean>(false)
  const { onAddAccount } = useAccounts()

  const handleLogin = async (data: any) => {
    setError('')
    setInProgress(true)
    try {
      const parsedData = JSON.parse(data)
      const validatedData = validateImportedAccountProps(parsedData)
      if (!validatedData.success) {
        setInProgress(false)
        return setError(validatedData.message || t('Invalid account data import.'))
      }

      onAddAccount(parsedData, { select: true })
    } catch (e: any) {
      setError(t('Invalid account data import.'))
    }
    setInProgress(false)
  }

  return { handleLogin, setError, error, inProgress }
}
