import { ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CONFIG from '@common/config/env'
import useToast from '@common/hooks/useToast'
import { fetchPost } from '@common/services/fetch'
import { authenticator } from '@otplib/preset-default'

const useOtp2Fa = ({ email, address }) => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const secret = useMemo(() => authenticator.generateSecret(20), [])

  const [otpAuth, setOtpAuth] = useState('')
  const [hexSecret, setHexSecret] = useState('')

  useEffect(() => {
    if (!email) return

    setOtpAuth(authenticator.keyuri(email, 'Ambire Wallet', secret))
    setHexSecret(
      ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes(JSON.stringify({ otp: secret, timestamp: new Date().getTime() }))
      )
    )
  }, [email, secret])

  const isValidToken = (token: string) => authenticator.verify({ token, secret })

  const sendEmail = async () => {
    if (!CONFIG.RELAYER_URL) {
      addToast(t('Email/pass accounts not supported without a relayer connection'), { error: true })
      return
    }

    const { success, confCodeRequired } = await fetchPost(
      // network doesn't matter when signing
      `${CONFIG.RELAYER_URL}/second-key/${address}/ethereum/sign`,
      {
        toSign: hexSecret
      }
    )
    if (!success)
      addToast(
        t('Unexpected error. This should never happen, please report this on help.ambire.com'),
        { error: true }
      )
    if (confCodeRequired !== 'email')
      addToast(
        t(
          'Expected email verification. This should never happen, please report this on help.ambire.com'
        ),
        { error: true }
      )
    if (success && confCodeRequired === 'email')
      addToast(t('A confirmation code was sent to your email, please enter it along...'))
  }

  return {
    sendEmail,
    isValidToken,
    otpAuth
  }
}

export default useOtp2Fa
