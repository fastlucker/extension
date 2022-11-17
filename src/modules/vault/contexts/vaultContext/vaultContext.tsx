import React, { createContext, useCallback, useMemo } from 'react'

import { useTranslation } from '@config/localization'
import useToast from '@modules/common/hooks/useToast'
import { BACKGROUND } from '@web/constants/paths'
import { sendMessage } from '@web/services/ambexMessanger'

import { vaultContextDefaults, VaultContextReturnType } from './types'

const VaultContext = createContext<VaultContextReturnType>(vaultContextDefaults)

const VaultProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { t } = useTranslation()

  const sendVaultMessage = ({
    method,
    props
  }: {
    method: string
    props: { [key: string]: any }
  }) => {
    if (sendMessage) {
      sendMessage({
        type: 'vaultController',
        to: BACKGROUND,
        data: {
          method,
          props
        }
      })
        .then((res) => {
          console.log('res', res)
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }

  const createPassword = useCallback(
    ({ password, confirmPassword }: { password: string; confirmPassword: string }) => {
      if (password === confirmPassword) {
        sendVaultMessage({
          method: 'createNewVaultPassword',
          props: {
            password
          }
        })
      } else {
        addToast(t("Passwords don't match."))
      }
    },
    [t, addToast]
  )

  return (
    <VaultContext.Provider value={useMemo(() => ({ createPassword }), [createPassword])}>
      {children}
    </VaultContext.Provider>
  )
}

export { VaultContext, VaultProvider }
