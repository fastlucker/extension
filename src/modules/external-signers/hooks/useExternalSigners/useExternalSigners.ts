import accountPresets from 'ambire-common/src/constants/accountPresets'
import passworder from 'browser-passworder'
import { generateAddress2 } from 'ethereumjs-util'
import { getDefaultProvider, Wallet } from 'ethers'
import { getAddress, hexZeroPad } from 'ethers/lib/utils'
import { useCallback } from 'react'

import CONFIG from '@config/env'
import { getProxyDeployBytecode } from '@modules/auth/services/IdentityProxyDeploy'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useStorage from '@modules/common/hooks/useStorage'
import useToast from '@modules/common/hooks/useToast'
import { fetchPost } from '@modules/common/services/fetch'

type AddSignerFormValues = {
  password?: string
  confirmPassword?: string
  signer: string
}

const SIGNERS_KEY = 'externalSigners'

const relayerURL = CONFIG.RELAYER_URL

const useExternalSigners = () => {
  const { network } = useNetwork()
  const { onAddAccount } = useAccounts()
  const { addToast } = useToast()
  const [externalSigners, setExternalSigners] = useStorage<any>({
    key: SIGNERS_KEY,
    defaultValue: {}
  })

  const hasRegisteredPasscode = !!Object.keys(externalSigners).length

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

  // EOA implementations
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

  const addExternalSigner = useCallback(
    async (
      { password, confirmPassword, signer }: AddSignerFormValues,
      onRequestAuthorization?: any
    ) => {
      try {
        if (!signer) return
        signer = '207d56b2f2b06fd9c74562ec81f42d47393a55cfcf5c182605220ad7fdfbe600'
        const provider = getDefaultProvider(network?.rpc)
        const wallet = new Wallet(signer, provider)

        if (!wallet) {
          addToast('Incorrect private key format.', {
            error: true,
            timeout: 4000
          })
          return
        }

        const addr = await wallet.getAddress()

        if (!password) {
          !!onRequestAuthorization && onRequestAuthorization()
          return
        }

        if (!hasRegisteredPasscode && password !== confirmPassword) {
          addToast("Passwords don't match.", {
            error: true,
            timeout: 4000
          })
          return
        }

        if (externalSigners[addr]) {
          passworder
            .decrypt(password, externalSigners[addr])
            .then(() => {
              onEOASelected(addr, { type: 'custom' })
            })
            .catch(() => {
              // TODO: better incorrect password err message
              addToast('Incorrect password.', {
                error: true,
                timeout: 4000
              })
            })
        } else {
          passworder.encrypt(password, signer).then((blob: string) => {
            setExternalSigners({
              ...externalSigners,
              [addr]: blob
            })
            onEOASelected(addr, { type: 'custom' })
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
    [
      hasRegisteredPasscode,
      network?.rpc,
      onEOASelected,
      externalSigners,
      setExternalSigners,
      addToast
    ]
  )

  return {
    addExternalSigner,
    hasRegisteredPasscode
  }
}

export default useExternalSigners
