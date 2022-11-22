import { Wallet } from 'ethers'
import { useCallback } from 'react'
import { Keyboard } from 'react-native'

import { isWeb } from '@config/env'
import useEOA from '@modules/common/hooks/useEOA'
import useToast from '@modules/common/hooks/useToast'
import useVault from '@modules/vault/hooks/useVault'

type AddSignerFormValues = {
  password: string
  signer: string
}

const useExternalSignerLogin = () => {
  const { addToast } = useToast()
  const { isValidPassword, addToVault } = useVault()
  const { onEOASelected } = useEOA()

  // Add new Ambire account or login with an existing one
  // default signer of the account will be the passed external private key
  const addExternalSigner = useCallback(
    async ({ signer, password }: AddSignerFormValues) => {
      try {
        if (!signer) {
          !isWeb && Keyboard.dismiss()
          addToast('Signer can not be empty.', {
            error: true,
            timeout: 4000
          })
          return
        }

        const isValidPass = await isValidPassword({ password })

        if (!isValidPass) {
          !isWeb && Keyboard.dismiss()
          addToast('Invalid password.', {
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

        addToVault({
          addr,
          item: {
            signer: wallet.privateKey,
            type: 'external'
          }
        })
          .then(() => {
            onEOASelected(addr, { type: 'Web3' })
          })
          .catch((e) => {
            addToast(e.message || e, { error: true })
          })
      } catch (e) {
        !isWeb && Keyboard.dismiss()
        addToast(e.message || e, {
          error: true,
          timeout: 4000
        })
      }
    },
    [onEOASelected, addToast, isValidPassword, addToVault]
  )

  return {
    addExternalSigner
  }
}

export default useExternalSignerLogin
