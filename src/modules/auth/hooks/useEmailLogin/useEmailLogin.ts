import { useEffect, useState } from 'react'

import { relayerURL } from '@modules/common/constants/relayer'
import useAccounts from '@modules/common/hooks/useAccounts'
import { fetchCaught } from '@modules/common/services/fetch'
import AsyncStorage from '@react-native-async-storage/async-storage'

import useAuth from '../useAuth'

type FormProps = {
  email: string
  passphrase: string
}

const EMAIL_VERIFICATION_RECHECK = 3000

export default function useEmailLogin() {
  const [requiresEmailConfFor, setRequiresConfFor] = useState<any>(null)
  const [err, setErr] = useState<any>('')
  const [inProgress, setInProgress] = useState<any>(false)

  const { onAddAccount } = useAccounts()
  const { setIsAuthenticated } = useAuth()

  const attemptLogin = async (
    { email, passphrase }: FormProps,
    ignoreEmailConfirmationRequired?: any
  ) => {
    // try by-email first: if this returns data we can just move on to decrypting
    // does not matter which network we request
    const loginSessionKey = await AsyncStorage.getItem('loginSessionKey')
    const { resp, body, errMsg }: any = await fetchCaught(
      `${relayerURL}/identity/by-email/${encodeURIComponent(email)}`,
      {
        headers: {
          authorization: loginSessionKey ? `Bearer ${loginSessionKey}` : null,
        },
      }
    )
    if (errMsg) {
      // TODO: set error (globally)
      // setErr(errMsg)
      return
    }

    if (resp.status === 401 && body.errType === 'UNAUTHORIZED') {
      if (ignoreEmailConfirmationRequired) {
        // we still have to call this to make sure the state is consistent and to force a re-render (to trigger the effect again)
        setRequiresConfFor({ email, passphrase })
        return
      }
      const requestAuthResp = await fetch(
        `${relayerURL}/identity/by-email/${encodeURIComponent(email)}/request-confirm-login`,
        { method: 'POST' }
      )
      if (requestAuthResp.status !== 200) {
        setErr(`Email confirmation needed but unable to request: ${requestAuthResp.status}`)
        return
      }
      const sessionKey = (await requestAuthResp.json()).sessionKey
      AsyncStorage.setItem('loginSessionKey', sessionKey)
      setRequiresConfFor({ email, passphrase })
      return
    }
    // If we make it beyond this point, it means no email confirmation will be required
    if (resp.status === 404 && body.errType === 'DOES_NOT_EXIST') {
      setRequiresConfFor(null)
      setErr('Account does not exist')
      return
    }

    if (resp.status === 200) {
      const identityInfo = body
      const { _id: id, salt, identityFactoryAddr, baseIdentityAddr, bytecode } = identityInfo
      const { quickAccSigner, primaryKeyBackup } = identityInfo.meta

      const success = onAddAccount(
        {
          id,
          email: identityInfo.meta.email,
          primaryKeyBackup,
          salt,
          identityFactoryAddr,
          baseIdentityAddr,
          bytecode,
          signer: quickAccSigner,
        },
        { select: true }
      )
      if (success) {
        setIsAuthenticated(true)
      }
      // Delete the key so that it can't be used anymore on this browser
      AsyncStorage.removeItem('loginSessionKey')
    } else {
      setErr(
        body.message ? `Relayer error: ${body.message}` : `Unknown no-message error: ${resp.status}`
      )
    }
    setRequiresConfFor(null)
  }

  const handleLogin = async ({ email, passphrase }: FormProps) => {
    setErr('')
    setRequiresConfFor(null)
    setInProgress(true)
    try {
      await attemptLogin({ email, passphrase })
    } catch (e: any) {
      setErr(`Unexpected error: ${e.message || e}`)
    }
    setInProgress(false)
  }

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

  return { handleLogin, requiresEmailConfFor, err, inProgress }
}
