import accountPresets from 'ambire-common/src/constants/accountPresets'
import { generateAddress2 } from 'ethereumjs-util'
import { Wallet } from 'ethers'
import { getAddress, hexZeroPad } from 'ethers/lib/utils'
import { useCallback } from 'react'
import { Keyboard } from 'react-native'

import CONFIG, { isWeb } from '@config/env'
import { getProxyDeployBytecode } from '@modules/auth/services/IdentityProxyDeploy'
import useAccounts from '@modules/common/hooks/useAccounts'
import useStorage from '@modules/common/hooks/useStorage'
import useToast from '@modules/common/hooks/useToast'
import { fetchPost } from '@modules/common/services/fetch'
import { decrypt, encrypt } from '@modules/common/services/passworder'

type AddSignerFormValues = {
  password?: string
  confirmPassword?: string
  signer: string
}

const SIGNERS_KEY = 'externalSigners'

const relayerURL = CONFIG.RELAYER_URL

const useExternalSigners = () => {
  const { onAddAccount } = useAccounts()
  const { addToast } = useToast()
  const [externalSigners, setExternalSigners] = useStorage<any>({
    key: SIGNERS_KEY,
    defaultValue: {}
  })

  const hasRegisteredPassword = !!Object.keys(externalSigners).length

  const getAccountByAddr = useCallback(async (idAddr, signerAddr) => {
    // In principle, we need these values to be able to operate in relayerless mode,
    // so we just store them in all cases
    // Plus, in the future this call may be used to retrieve other things
    const { salt, identityFactoryAddr, baseIdentityAddr, bytecode } = await fetch(
      `${relayerURL}/identity/${idAddr}`
    ).then((r) => r.json())
    if (!(salt && identityFactoryAddr && baseIdentityAddr && bytecode))
      throw new Error(`Incomplete data from relayer for ${idAddr}`)
    return {
      id: idAddr,
      salt,
      identityFactoryAddr,
      baseIdentityAddr,
      bytecode,
      signer: { address: signerAddr }
    }
  }, [])

  const getOwnedByEOAs = useCallback(
    async (eoas) => {
      const allUniqueOwned: any = {}

      await Promise.all(
        eoas.map(async (signerAddr: any) => {
          const resp = await fetch(
            `${relayerURL}/identity/any/by-owner/${signerAddr}?includeFormerlyOwned=true`
          )
          const privEntries = Object.entries(await resp.json())
          // discard the privileges value, we do not need it as we wanna add all accounts EVER owned by this eoa
          // eslint-disable-next-line no-return-assign
          privEntries.forEach(([id]) => (allUniqueOwned[id] = getAddress(signerAddr)))
        })
      )

      return Promise.all(
        Object.entries(allUniqueOwned).map(([id, signer]) => getAccountByAddr(id, signer))
      )
    },
    [getAccountByAddr]
  )

  // EOA implementations = Externally Owned Account
  // Add or create accounts from Trezor/Ledger/Metamask/etc.
  const createFromEOA = useCallback(async (addr, signerType) => {
    const privileges = [[getAddress(addr), hexZeroPad('0x01', 32)]]
    const { salt, baseIdentityAddr, identityFactoryAddr } = accountPresets
    const bytecode = getProxyDeployBytecode(baseIdentityAddr, privileges, { privSlot: 0 })
    const identityAddr = getAddress(
      `0x${generateAddress2(
        // Converting to buffer is required in ethereumjs-util version: 7.1.3
        Buffer.from(identityFactoryAddr.slice(2), 'hex'),
        Buffer.from(salt.slice(2), 'hex'),
        Buffer.from(bytecode.slice(2), 'hex')
      ).toString('hex')}`
    )

    if (relayerURL) {
      const createResp = await fetchPost(`${relayerURL}/identity/${identityAddr}`, {
        salt,
        identityFactoryAddr,
        baseIdentityAddr,
        privileges,
        signerType
      })
      if (
        !createResp.success &&
        !(createResp.message && createResp.message.includes('already exists'))
      )
        throw createResp
    }

    return {
      id: identityAddr,
      salt,
      identityFactoryAddr,
      baseIdentityAddr,
      bytecode,
      signer: { address: getAddress(addr) }
    }
  }, [])

  const onEOASelected = useCallback(
    async (addr, signerExtra) => {
      const addAccount = (acc, opts) => onAddAccount({ ...acc, signerExtra }, opts)
      // when there is no relayer, we can only add the 'default' account created from that EOA
      // @TODO in the future, it would be nice to do getLogs from the provider here to find out which other addrs we control
      //   ... maybe we can isolate the code for that in lib/relayerless or something like that to not clutter this code
      if (!relayerURL)
        return addAccount(await createFromEOA(addr, signerExtra.type), { select: true })
      // otherwise check which accs we already own and add them
      const owned = await getOwnedByEOAs([addr])
      if (!owned.length) {
        addAccount(await createFromEOA(addr, signerExtra.type), { select: true, isNew: true })
      } else {
        addToast(`Found ${owned.length} existing accounts with signer ${addr}`, { timeout: 15000 })
        owned.forEach((acc, i) => addAccount(acc, { select: i === 0 }))
      }
    },
    [addToast, createFromEOA, getOwnedByEOAs, onAddAccount]
  )

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
    decryptExternalSigner,
    hasRegisteredPassword
  }
}

export default useExternalSigners
