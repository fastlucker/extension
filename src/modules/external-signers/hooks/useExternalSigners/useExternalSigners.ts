import { Wallet } from 'ethers'
import { useCallback } from 'react'
import { Keyboard } from 'react-native'

import { isWeb } from '@config/env'
import useEOA from '@modules/common/hooks/useEOA'
import useStorage from '@modules/common/hooks/useStorage'
import useToast from '@modules/common/hooks/useToast'
import { decrypt, encrypt } from '@modules/common/services/passworder'

type AddSignerFormValues = {
  password?: string
  confirmPassword?: string
  signer: string
}

const SIGNERS_KEY = 'externalSigners'

const useExternalSigners = () => {
  const { addToast } = useToast()
  const { onEOASelected } = useEOA()
  const [externalSigners, setExternalSigners] = useStorage<any>({
    key: SIGNERS_KEY,
    defaultValue: {}
  })

  const hasRegisteredPassword = !!Object.keys(externalSigners).length

  // Add new Ambire account or login with an existing one
  // default signer of the account will be the passed external private key
  const addExternalSigner = useCallback(
    async (
      { password, confirmPassword, signer }: AddSignerFormValues,
      onRequestAuthorization?: any
    ) => {
      try {
        if (!signer) {
          !isWeb && Keyboard.dismiss()
          addToast('Signer can not be empty.', {
            error: true,
            timeout: 4000
          })
          return
        }

        const wallet = new Wallet(signer)

        if (!wallet) {
          !isWeb && Keyboard.dismiss()
          addToast('Incorrect private key format.', {
            error: true,
            timeout: 4000
          })
          return
        }

        // the public addr of the signer
        const addr = await wallet.getAddress()

        if (!password) {
          !isWeb && Keyboard.dismiss()
          !!onRequestAuthorization && onRequestAuthorization()
          return
        }

        if (!hasRegisteredPassword && password !== confirmPassword) {
          !isWeb && Keyboard.dismiss()
          addToast("Passwords don't match.", {
            error: true,
            timeout: 4000
          })
          return
        }

        // If there is a registered password and the signer address is found in externalSigners
        if (externalSigners[addr]) {
          decrypt(password, externalSigners[addr])
            .then(() => {
              onEOASelected(addr, { type: 'Web3' })
            })
            .catch(() => {
              !isWeb && Keyboard.dismiss()
              addToast('Incorrect signer password.', {
                error: true,
                timeout: 4000
              })
            })
          // If there is a registered password but it's a new signer address
        } else if (hasRegisteredPassword && !externalSigners[addr]) {
          decrypt(password, externalSigners[Object.keys(externalSigners)[0]])
            .then(() => {
              encrypt(password, signer).then((blob: string) => {
                setExternalSigners({
                  ...externalSigners,
                  [addr]: blob
                })
                onEOASelected(addr, { type: 'Web3' })
              })
            })
            .catch(() => {
              !isWeb && Keyboard.dismiss()
              addToast('Incorrect signer password.', {
                error: true,
                timeout: 4000
              })
            })
          // If there is no registered password add a new signer encrypted with the given password
        } else {
          encrypt(password, signer).then((blob: string) => {
            setExternalSigners({
              ...externalSigners,
              [addr]: blob
            })
            onEOASelected(addr, { type: 'Web3' })
          })
        }
      } catch (e) {
        !isWeb && Keyboard.dismiss()
        addToast(e.message || e, {
          error: true,
          timeout: 4000
        })
      }
    },
    [hasRegisteredPassword, onEOASelected, externalSigners, setExternalSigners, addToast]
  )

  const removeExternalSigner = useCallback(
    (signerAddr: AddSignerFormValues['signer']) => {
      if (!hasRegisteredPassword) return

      const nextExternalSigners = { ...externalSigners }
      delete nextExternalSigners[signerAddr]

      setExternalSigners(nextExternalSigners)
    },
    [hasRegisteredPassword, externalSigners, setExternalSigners]
  )

  // Always resolve but return the signer's private key only on successful decryption
  const decryptExternalSigner = useCallback(
    ({ signerPublicAddr, password }) => {
      return new Promise((resolve) => {
        if (!externalSigners[signerPublicAddr]) {
          // TODO: would be good to redirect to add external signer in this case
          !isWeb && Keyboard.dismiss()
          resolve(false)
        }
        decrypt(password, externalSigners[signerPublicAddr])
          .then((result: any) => {
            resolve(result)
          })
          .catch(() => {
            !isWeb && Keyboard.dismiss()
            resolve(false)
          })
      })
    },
    [externalSigners]
  )

  return {
    addExternalSigner,
    removeExternalSigner,
    decryptExternalSigner,
    hasRegisteredPassword,
    externalSigners
  }
}

export default useExternalSigners
