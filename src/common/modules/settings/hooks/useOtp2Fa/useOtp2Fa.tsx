import { ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CONFIG from '@common/config/env'
import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import { fetchPost } from '@common/services/fetch'
import { authenticator } from '@otplib/preset-default'

const useOtp2Fa = ({ email, accountId }) => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { goBack } = useNavigation()
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const [otpAuth, setOtpAuth] = useState('')
  const [secret, setSecret] = useState('')
  const [hexSecret, setHexSecret] = useState('')

  const sendEmail = async () => {
    const nextSecret = authenticator.generateSecret(20)
    const nextHexSecret = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes(JSON.stringify({ otp: nextSecret, timestamp: new Date().getTime() }))
    )

    if (!CONFIG.RELAYER_URL) {
      addToast(t('Email/pass accounts not supported without a relayer connection'), { error: true })
      return
    }

    setIsSendingEmail(true)
    try {
      const { success, confCodeRequired } = await fetchPost(
        // network doesn't matter when signing
        `${CONFIG.RELAYER_URL}/second-key/${accountId}/ethereum/sign`,
        {
          toSign: nextHexSecret
        }
      )

      if (!success || confCodeRequired !== 'email') {
        addToast(
          t('Unexpected error. This should never happen, please report this on help.ambire.com'),
          { error: true }
        )

        setIsSendingEmail(false)
        return false
      }

      addToast(t('A confirmation code was sent to your email, please enter it along...'))

      setSecret(nextSecret)
      setHexSecret(nextHexSecret)
      setOtpAuth(authenticator.keyuri(email, 'Ambire Wallet', nextSecret))

      setIsSendingEmail(false)
      return true
    } catch {
      addToast(t('The request for sending an email failed. Please try again later.'), {
        error: true
      })

      setIsSendingEmail(false)
      return false
    }
  }

  const verifyOTP = async ({ emailConfirmCode, otpCode }) => {
    const isValid = authenticator.verify({ token: otpCode, secret })

    if (!isValid) {
      addToast(
        'Invalid or outdated OTP code entered. If you keep seeing this, please ensure your system clock is synced correctly.',
        { error: true }
      )
      return
    }

    try {
      if (!emailConfirmCode) {
        addToast('Please enter the code from authenticator app.')
        return
      }

      const { success, signatureEthers, message } = await fetchPost(
        // network doesn't matter when signing
        `${CONFIG.RELAYER_URL}/second-key/${accountId}/ethereum/sign`,
        {
          toSign: hexSecret,
          code: emailConfirmCode
        }
      )

      if (!success) {
        throw new Error(`Wrong email confirmation code. Details: ${message}`)
      }

      const resp = await fetchPost(`${CONFIG.RELAYER_URL}/identity/${accountId}/modify`, {
        otp: hexSecret,
        sig: signatureEthers
      })

      if (!resp.success) {
        throw new Error(`Something went wrong. Please try again later. Details: ${resp.message}`)
      }

      addToast('You have successfully enabled two-factor authentication.')
      goBack()
    } catch (e) {
      console.error(e)
      addToast(e?.message || t('Something went wrong. Please try again later.'), { error: true })
    }
  }

  const disableOTP = useCallback(
    async ({ otpCode }) => {
      const nextHexSecret = ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes(JSON.stringify({ otp: null, timestamp: new Date().getTime() }))
      )

      try {
        const { success, signatureEthers, message } = await fetchPost(
          // network doesn't matter when signing
          `${CONFIG.RELAYER_URL}/second-key/${accountId}/ethereum/sign`,
          {
            toSign: nextHexSecret,
            code: otpCode
          }
        )
        if (!success) {
          throw new Error(`Wrong email confirmation code. Details: ${message}`)
        }

        const resp = await fetchPost(`${CONFIG.RELAYER_URL}/identity/${accountId}/modify`, {
          otp: nextHexSecret,
          sig: signatureEthers
        })

        if (!resp.success) {
          throw new Error(`Something went wrong. Please try again later. Details: ${resp.message}`)
        }

        addToast('You have successfully disabled two-factor authentication.')
        goBack()
      } catch (e) {
        addToast(e?.message || t('Something went wrong. Please try again later.'), { error: true })
      }
    },
    [accountId, addToast, goBack, t]
  )

  return {
    sendEmail,
    verifyOTP,
    disableOTP,
    isSendingEmail,
    otpAuth,
    secret
  }
}

export default useOtp2Fa
