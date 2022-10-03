import { useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

import CONFIG from '@config/env'
import { SyncStorage } from '@config/storage'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import { fetchCaught } from '@modules/common/services/fetch'

type FormProps = {
  email: string
}

const EMAIL_VERIFICATION_RECHECK = 3000

export default function useEmailLogin() {
  const { addToast } = useToast()
  const [requiresEmailConfFor, setRequiresConfFor] = useState<FormProps | null>(null)
  const [err, setErr] = useState<string>('')
  const [inProgress, setInProgress] = useState<boolean>(false)
  const { onAddAccount } = useAccounts()

  const attemptLogin = useCallback(
    async ({ email }: FormProps, ignoreEmailConfirmationRequired?: any) => {
      // try by-email first: if this returns data we can just move on to decrypting
      // does not matter which network we request
      const loginSessionKey = await SyncStorage.getItem('loginSessionKey')
      const { resp, body, errMsg }: any = await fetchCaught(
        `${CONFIG.RELAYER_URL}/identity/by-email/${encodeURIComponent(email)}`,
        {
          headers: {
            authorization: loginSessionKey ? `Bearer ${loginSessionKey}` : null
          }
        }
      )
      if (errMsg) {
        setErr(errMsg)
        if (ignoreEmailConfirmationRequired) {
          addToast(errMsg, { error: true })
        }
        return
      }

      if (resp.status === 401 && body.errType === 'UNAUTHORIZED') {
        if (ignoreEmailConfirmationRequired) {
          // we still have to call this to make sure the state is consistent and to force a re-render (to trigger the effect again)
          SyncStorage.setItem('loginEmail', email)
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
          setErr(`Email confirmation needed but unable to request: ${requestAuthResp.status}`)
          return
        }
        const sessionKey = (await requestAuthResp.json()).sessionKey
        SyncStorage.setItem('loginSessionKey', sessionKey)
        SyncStorage.setItem('loginEmail', email)
        setRequiresConfFor({ email })
        return
      }
      // If we make it beyond this point, it means no email confirmation will be required
      if (resp.status === 404 && body.errType === 'DOES_NOT_EXIST') {
        setRequiresConfFor(null)
        SyncStorage.removeItem('loginEmail')
        setErr('Account does not exist')
        return
      }

      if (resp.status === 200) {
        const identityInfo = body
        const { _id: id, salt, identityFactoryAddr, baseIdentityAddr, bytecode } = identityInfo
        const { quickAccSigner, primaryKeyBackup } = identityInfo.meta

        onAddAccount(
          {
            id,
            email: identityInfo.meta.email,
            primaryKeyBackup,
            salt,
            identityFactoryAddr,
            baseIdentityAddr,
            bytecode,
            signer: quickAccSigner
          },
          { select: true }
        )

        // Delete the key so that it can't be used anymore on this browser
        SyncStorage.removeItem('loginSessionKey')
        SyncStorage.removeItem('loginEmail')
      } else {
        setErr(
          body.message
            ? `Relayer error: ${body.message}`
            : `Unknown no-message error: ${resp.status}`
        )
      }
      setRequiresConfFor(null)
      SyncStorage.removeItem('loginEmail')
    },
    [addToast, onAddAccount]
  )

  const handleLogin = async ({ email }: FormProps) => {
    Keyboard.dismiss()
    setErr('')
    setRequiresConfFor(null)
    SyncStorage.removeItem('loginEmail')
    setInProgress(true)
    try {
      await attemptLogin({ email })
    } catch (e: any) {
      setErr(`Unexpected error: ${e.message || e}`)
    }
    setInProgress(false)
  }

  const handlePendingLogin = useCallback(async () => {
    setTimeout(async () => {
      const email = await SyncStorage.getItem('loginEmail')
      SyncStorage.removeItem('loginEmail')
      if (email) {
        await attemptLogin({ email })
      }
    }, 400)
  }, [attemptLogin])

  // try logging in once after EMAIL_VERIFICATION_RECHECK
  useEffect(() => {
    if (requiresEmailConfFor) {
      const timer = setTimeout(async () => {
        setInProgress(true)
        await attemptLogin(requiresEmailConfFor, true)
        setInProgress(false)
      }, EMAIL_VERIFICATION_RECHECK)
      return () => clearTimeout(timer)
    }
  })

  return { handleLogin, handlePendingLogin, requiresEmailConfFor, err, inProgress }
}
