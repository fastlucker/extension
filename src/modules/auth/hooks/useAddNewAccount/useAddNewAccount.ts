import { useState } from 'react'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import { fetchCaught } from '@modules/common/services/fetch'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Props = {}

export default function useEmailLogin() {
  const [err, setErr] = useState('')
  const [addAccErr, setAddAccErr] = useState('')
  const [inProgress, setInProgress] = useState(false)

  const { onAddAccount } = useAccounts()

  const wrapProgress = async (fn, type = true) => {
    setInProgress(type)
    try {
      await fn()
    } catch (e) {
      console.error(e)
      setAddAccErr(`Unexpected error: ${e.message || e}`)
    }
    setInProgress(false)
  }

  const wrapErr = async (fn) => {
    setAddAccErr('')
    try {
      await fn()
    } catch (e) {
      console.error(e)
      setInProgress(false)
      setAddAccErr(`Unexpected error: ${e.message || e}`)
    }
  }

  return {}
}
