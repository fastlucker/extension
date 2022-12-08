import { Wallet } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Keyboard } from 'react-native'

import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useStorageController from '@modules/common/hooks/useStorageController'
import useToast from '@modules/common/hooks/useToast'
import { fetchCaught } from '@modules/common/services/fetch'
import useVault from '@modules/vault/hooks/useVault'

type FormProps = {
  email: string
  password?: string
}

const EMAIL_VERIFICATION_RECHECK = 3000

export default function useEmailLogin() {
  const { addToast } = useToast()
  const { getItem, setItem, removeItem } = useStorageController()
  const { onAddAccount } = useAccounts()
  const { addToVault } = useVault()
  const { t } = useTranslation()

  const pendingLoginEmail = getItem('pendingLoginEmail')

  const [requiresEmailConfFor, setRequiresConfFor] = useState<FormProps | null>(
    pendingLoginEmail ? { email: pendingLoginEmail } : null
  )

  const [inProgress, setInProgress] = useState<boolean>(false)
  const [accountData, setAccountData] = useState<any>(null)

  const requiresPassword = useMemo(() => !!accountData, [accountData])

  const handleAddAccount = () => {
    if (!accountData) {
      addToast(t('Email not confirmed'), { error: true })
    }

    const { _id: id, salt, identityFactoryAddr, baseIdentityAddr, bytecode } = accountData
    const { quickAccSigner, primaryKeyBackup } = accountData.meta

    onAddAccount(
      {
        id,
        email: accountData.meta.email,
        primaryKeyBackup,
        salt,
        identityFactoryAddr,
        baseIdentityAddr,
        bytecode,
        signer: quickAccSigner
      },
      { select: true }
    )
  }

  const attemptLogin = useCallback(
    async ({ email }: FormProps, ignoreEmailConfirmationRequired?: any) => {
      // try by-email first: if this returns data we can just move on to decrypting
      // does not matter which network we request
      const loginSessionKey = getItem('loginSessionKey')
      const { resp, body, errMsg }: any = await fetchCaught(
        `${CONFIG.RELAYER_URL}/identity/by-email/${encodeURIComponent(email)}`,
        {
          headers: {
            authorization: loginSessionKey ? `Bearer ${loginSessionKey}` : null
          }
        }
      )
      if (errMsg) {
        addToast(errMsg, { error: true })

        return
      }

      if (resp.status === 401 && body.errType === 'UNAUTHORIZED') {
        if (ignoreEmailConfirmationRequired) {
          // we still have to call this to make sure the state is consistent and to force a re-render (to trigger the effect again)
          setItem('pendingLoginEmail', email)
          setRequiresConfFor({ email })
          return
        }
        const requestAuthResp = await fetch(
          `${CONFIG.RELAYER_URL}/identity/by-email/${encodeURIComponent(
            email
          )}/request-confirm-login`,
          { method: 'POST' }
        )
        if (requestAuthResp.status !== 200) {
          addToast(`Email confirmation needed but unable to request: ${requestAuthResp.status}`, {
            error: true
          })
          return
        }
        const sessionKey = (await requestAuthResp.json()).sessionKey
        setItem('loginSessionKey', sessionKey)
        setItem('pendingLoginEmail', email)
        setRequiresConfFor({ email })
        return
      }
      // If we make it beyond this point, it means no email confirmation will be required
      if (resp.status === 404 && body.errType === 'DOES_NOT_EXIST') {
        removeItem('pendingLoginEmail')
        setRequiresConfFor(null)
        addToast('Account does not exist', {
          error: true
        })

        return
      }

      if (resp.status === 200) {
        setAccountData(body)
        // Delete the key so that it can't be used anymore on this browser
        removeItem('loginSessionKey')
      } else {
        addToast(
          body.message
            ? `Relayer error: ${body.message}`
            : `Unknown no-message error: ${resp.status}`
        )
      }
      setRequiresConfFor(null)
    },
    [addToast, getItem, removeItem, setItem]
  )

  const handleLogin = async ({ email, password }: FormProps) => {
    Keyboard.dismiss()

    setRequiresConfFor(null)
    removeItem('pendingLoginEmail')
    setInProgress(true)
    if (!accountData) {
      try {
        await attemptLogin({ email })
      } catch (e: any) {
        addToast(`Unexpected error: ${e.message || e}`)
      }
    } else if (accountData && !password) {
      addToast('Password is required', { error: true })
    } else {
      try {
        const wallet = await Wallet.fromEncryptedJson(
          JSON.parse(accountData.meta.primaryKeyBackup),
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
            handleAddAccount()
          })
          .catch((e) => {
            addToast(e.message || e, { error: true })
          })
      } catch (error) {
        addToast('Invalid Account Password', { error: true })
      }
    }

    setInProgress(false)
  }

  const cancelLoginAttempts = useCallback(() => {
    setRequiresConfFor(null)
    removeItem('pendingLoginEmail')
  }, [removeItem])

  // try logging in once after EMAIL_VERIFICATION_RECHECK
  useEffect(() => {
    if (requiresEmailConfFor && !accountData) {
      const timer = setTimeout(async () => {
        setInProgress(true)
        await attemptLogin(requiresEmailConfFor, true)
        setInProgress(false)
      }, EMAIL_VERIFICATION_RECHECK)
      return () => clearTimeout(timer)
    }
  })

  return {
    handleLogin,
    cancelLoginAttempts,
    requiresEmailConfFor,
    requiresPassword,
    inProgress,
    accountData
  }
}
