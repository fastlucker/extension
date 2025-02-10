import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { isDev, isTesting } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useToast from '@common/hooks/useToast'
import { DEFAULT_KEYSTORE_PASSWORD_DEV } from '@env'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

const useKeyStoreSetup = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const state = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()
  const { control, handleSubmit, watch, trigger, getValues, formState } = useForm({
    mode: 'all',
    defaultValues: {
      password: isDev && !isTesting ? DEFAULT_KEYSTORE_PASSWORD_DEV ?? '' : '',
      confirmPassword: isDev && !isTesting ? DEFAULT_KEYSTORE_PASSWORD_DEV ?? '' : ''
    }
  })
  const [isKeystoreReady, setKeystoreReady] = useState(false)
  const password = watch('password', '')
  const [mousePosition, setMousePosition] = useState<{
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    if (!getValues('confirmPassword')) return

    trigger('confirmPassword').catch(() => {
      addToast(t('Something went wrong, please try again later.'), { type: 'error' })
    })
  }, [password, trigger, addToast, t, getValues])

  useEffect(() => {
    if (state.statuses.addSecret === 'SUCCESS') {
      setKeystoreReady(true)
    }
  }, [state.statuses.addSecret])

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleKeystoreSetup = async () => {
    await handleSubmit(({ password: passwordFieldValue }) => {
      const extraEntropy = mousePosition
        ? // eslint-disable-next-line no-bitwise
          new Uint8Array([mousePosition.x, mousePosition.y])
        : null

      dispatch({
        type: 'KEYSTORE_CONTROLLER_ADD_SECRET',
        params: {
          secretId: 'password',
          secret: passwordFieldValue,
          extraEntropy,
          leaveUnlocked: true
        }
      })
    })()
  }

  const isKeystoreSetupLoading = state.statuses.addSecret !== 'INITIAL'

  return {
    isKeystoreReady,
    isKeystoreSetupLoading,
    formState,
    control,
    password,
    handleKeystoreSetup,
    hasPasswordSecret: state.hasPasswordSecret
  }
}

export default useKeyStoreSetup
