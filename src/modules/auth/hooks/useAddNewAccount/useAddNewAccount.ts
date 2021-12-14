import { generateAddress2 } from 'ethereumjs-util'
import { Wallet } from 'ethers'
import { AbiCoder, getAddress, id, keccak256 } from 'ethers/lib/utils'
import { useState } from 'react'
import performance from 'react-native-performance'

import CONFIG from '@config/env'
import { getProxyDeployBytecode } from '@modules/auth/services/IdentityProxyDeploy'
import accountPresets from '@modules/common/constants/accountPresets'
import useAccounts from '@modules/common/hooks/useAccounts'
import { fetchPost } from '@modules/common/services/fetch'

type FormProps = {
  email: string
  password: string
  backup: boolean
}

export default function useEmailLogin() {
  const [err, setErr] = useState<any>('')
  const [addAccErr, setAddAccErr] = useState<any>('')
  const [inProgress, setInProgress] = useState<any>(false)

  const { onAddAccount } = useAccounts()

  const wrapProgress = async (fn: () => any, type: boolean | string = true) => {
    setInProgress(type)
    try {
      await fn()
    } catch (e: any) {
      console.error(e)
      setAddAccErr(`Unexpected error: ${e.message || e}`)
    }
    setInProgress(false)
  }

  const wrapErr = async (fn: () => any) => {
    setAddAccErr('')
    try {
      await fn()
    } catch (e: any) {
      console.error(e)
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
      two: quickAccountTuple[2],
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

    const createResp = await fetchPost(`${CONFIG.RELAYER_URL}/identity/${identityAddr}`, {
      email: req.email,
      primaryKeyBackup: req.backup ? undefined : primaryKeyBackup,
      secondKeySecret,
      salt,
      identityFactoryAddr,
      baseIdentityAddr,
      privileges,
      quickAccSigner: signer,
    })
    if (createResp.message === 'EMAIL_ALREADY_USED') {
      setErr('An account with this email already exists')
      return
    }
    if (!createResp.success) {
      console.log(createResp)
      setErr(`Unexpected sign up error: ${createResp.message || 'unknown'}`)
      return
    }

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
        emailConfRequired: true,
      },
      { select: true, isNew: true }
    )
  }

  const handleAddNewAccount = (req: FormProps) => {
    wrapProgress(() => createQuickAcc(req), 'email')
  }

  return { handleAddNewAccount, wrapErr, wrapProgress, err, addAccErr, inProgress }
}
