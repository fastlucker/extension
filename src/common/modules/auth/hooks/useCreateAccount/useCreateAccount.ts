import accountPresets from 'ambire-common/src/constants/accountPresets'
import { generateAddress2 } from 'ethereumjs-util'
import { Wallet } from 'ethers'
import { AbiCoder, getAddress, id, keccak256 } from 'ethers/lib/utils'
import { useState } from 'react'
import { Keyboard } from 'react-native'
import performance from 'react-native-performance'

import CONFIG from '@common/config/env'
import useAccounts from '@common/hooks/useAccounts'
import useStorageController from '@common/hooks/useStorageController'
import useToast from '@common/hooks/useToast'
import { getProxyDeployBytecode } from '@common/modules/auth/services/IdentityProxyDeploy'
import useVault from '@common/modules/vault/hooks/useVault'
import { fetchPost } from '@common/services/fetch'

type FormProps = {
  email: string
  password: string
  backup: boolean
}

export default function useCreateAccount() {
  const [err, setErr] = useState<string>('')
  const [addAccErr, setAddAccErr] = useState<string>('')
  const [inProgress, setInProgress] = useState<boolean | string>(false)
  const { getItem } = useStorageController()

  const { onAddAccount } = useAccounts()
  const { addToast } = useToast()
  const { addToVault } = useVault()

  const wrapProgress = async (fn: () => any, type: boolean | string = true) => {
    setInProgress(type)
    try {
      await fn()
    } catch (e: any) {
      setAddAccErr(`Unexpected error: ${e.message || e}`)
    }
    setInProgress(false)
  }

  const wrapErr = async (fn: () => any) => {
    setAddAccErr('')
    try {
      await fn()
    } catch (e: any) {
      setInProgress(false)
      setAddAccErr(`Unexpected error: ${e.message || e}`)
    }
  }

  const createQuickAcc = async (req: FormProps) => {
    setErr('')

    // async hack to let React run a tick so it can re-render before the blocking Wallet.createRandom()
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 0))

    const extraEntropy = id(
      `${req.email}:${Date.now()}:${Math.random()}:${
        typeof performance === 'object' && performance.now()
      }`
    )
    const firstKeyWallet = Wallet.createRandom({ extraEntropy })
    // 6 words is 2048**6
    const secondKeySecret = `${Wallet.createRandom({ extraEntropy })
      .mnemonic.phrase.split(' ')
      .slice(0, 6)
      .join(' ')} ${req.email}`

    const secondKeyResp = await fetchPost(`${CONFIG.RELAYER_URL}/second-key`, { secondKeySecret })
    if (!secondKeyResp.address)
      throw new Error(
        `second-key returned no address, error: ${secondKeyResp.message || secondKeyResp}`
      )

    const { salt, baseIdentityAddr, identityFactoryAddr, quickAccManager, quickAccTimelock } =
      accountPresets
    const quickAccountTuple = [quickAccTimelock, firstKeyWallet.address, secondKeyResp.address]
    const signer = {
      quickAccManager,
      timelock: quickAccountTuple[0],
      one: quickAccountTuple[1],
      two: quickAccountTuple[2]
    }
    const abiCoder = new AbiCoder()
    const accHash = keccak256(
      abiCoder.encode(['tuple(uint, address, address)'], [quickAccountTuple])
    )
    const privileges = [[quickAccManager, accHash]]
    const bytecode = getProxyDeployBytecode(baseIdentityAddr, privileges, { privSlot: 0 })
    const identityAddr = getAddress(
      `0x${generateAddress2(
        // Converting to buffer is required in ethereumjs-util version: 7.1.3
        // Version 6 allows Buffer or string types but installed in RN proj brakes with: Can't find variable: Buffer
        Buffer.from(identityFactoryAddr.slice(2), 'hex'),
        Buffer.from(salt.slice(2), 'hex'),
        Buffer.from(bytecode.slice(2), 'hex')
      ).toString('hex')}`
    )
    const primaryKeyBackup = JSON.stringify(
      await firstKeyWallet.encrypt(req.password, accountPresets.encryptionOpts)
    )

    const referral = getItem('pendingReferral')

    const createResp = await fetchPost(`${CONFIG.RELAYER_URL}/identity/${identityAddr}`, {
      email: req.email,
      primaryKeyBackup: req.backup ? undefined : primaryKeyBackup,
      secondKeySecret,
      salt,
      identityFactoryAddr,
      baseIdentityAddr,
      privileges,
      quickAccSigner: signer,
      ...(!!referral && { referral })
    })
    if (createResp.message === 'EMAIL_ALREADY_USED') {
      setErr('An account with this email already exists')
      return
    }
    if (!createResp.success) {
      setErr(`Unexpected sign up error: ${createResp.message || 'unknown'}`)
      return
    }

    const addr = await firstKeyWallet.getAddress()
    addToVault({
      addr,
      item: {
        signer: firstKeyWallet.privateKey,
        password: req.password,
        type: 'quickAcc'
      }
    })
      .then(() => {
        onAddAccount(
          {
            id: identityAddr,
            email: req.email,
            primaryKeyBackup,
            salt,
            identityFactoryAddr,
            baseIdentityAddr,
            bytecode,
            signer,
            // This makes the modal appear, and will be removed by the modal which will call onAddAccount to update it
            emailConfRequired: true
          },
          { select: true, isNew: true }
        )
      })
      .catch((e) => {
        addToast(e.message || e, { error: true })
      })
  }

  const handleAddNewAccount = async (req: FormProps) => {
    Keyboard.dismiss()
    await wrapProgress(() => createQuickAcc(req), 'email')
  }

  return { handleAddNewAccount, wrapErr, wrapProgress, err, addAccErr, inProgress }
}
