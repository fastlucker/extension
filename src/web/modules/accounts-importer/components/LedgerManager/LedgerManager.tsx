import { hashMessage, hexlify, toUtf8Bytes } from 'ethers'
import React, { useEffect } from 'react'

import Button from '@common/components/Button'
import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import AccountsList from '@web/modules/accounts-importer/components/AccountsList'
import useAccountsPagination from '@web/modules/accounts-importer/hooks/useAccountsPagination'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'
import LedgerSigner from '@web/modules/hardware-wallet/libs/ledgerSigner'

interface Props {}

const LedgerManager: React.FC<Props> = (props) => {
  const [keysList, setKeysList] = React.useState<any[]>([])

  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const [loading, setLoading] = React.useState(true)
  const stoppedRef = React.useRef(true)
  const { createTask } = useTaskQueue()
  const { hardwareWallets } = useHardwareWallets()
  const { page, pageStartIndex, pageEndIndex } = useAccountsPagination()

  const onImportReady = () => {
    updateStepperState(2, 'hwAuth')
    navigate(WEB_ROUTES.createKeyStore)
  }

  const asyncGetKeys: any = React.useCallback(async () => {
    stoppedRef.current = false
    setLoading(true)
    let i = pageStartIndex
    try {
      await createTask(() => hardwareWallets[HARDWARE_WALLETS.LEDGER].unlock())
      for (i = pageStartIndex; i <= pageEndIndex; ) {
        // eslint-disable-next-line no-await-in-loop
        const keys = (await createTask(() =>
          hardwareWallets[HARDWARE_WALLETS.LEDGER].getKeys(i, i)
        )) as any[]
        setKeysList((prev) => [...prev, ...keys])
        setLoading(false)
        i++
      }
    } catch (e) {
      console.error(e.message)
      return
    }
    stoppedRef.current = true
  }, [createTask, hardwareWallets, pageStartIndex, pageEndIndex])

  const runGetKeys = React.useCallback(async () => {
    setKeysList([])
    asyncGetKeys()
  }, [asyncGetKeys])

  useEffect(() => {
    runGetKeys()
  }, [page, runGetKeys])

  return (
    <>
      <AccountsList
        accounts={keysList.map((key, i) => ({
          address: key,
          index: pageStartIndex + i + 1
        }))}
        loading={loading}
        onImportReady={onImportReady}
        {...props}
      />
      <Button
        text="sign transaction with ledger"
        onPress={
          // Only for testing
          () => {
            const key_idx = 2

            const key = {
              id: '0xF0cD725D2195b1D3f4BD038c3786005B793237DB',
              type: 'ledger',
              label: 'ledger-test-key',
              isExternallyStored: false,
              meta: {
                derivationPath: `m/44'/60'/${key_idx}'/0/0`,
                index: key_idx
              }
            }

            const txn = {
              from: '0xF0cD725D2195b1D3f4BD038c3786005B793237DB',
              to: '0x15a45946F2561704203057165507404d9C37F762',
              data: '0xabcdef',
              gas: hexlify(toUtf8Bytes('200000')),
              gasPrice: hexlify(toUtf8Bytes('1000000000')),
              nonce: hexlify(toUtf8Bytes('0')),
              chainId: 137
            }

            const signer = new LedgerSigner(key)
            signer.init(hardwareWallets[HARDWARE_WALLETS.LEDGER])
            signer.signRawTransaction(txn)
          }
        }
      />
      <Button
        text="sign personal message with ledger"
        onPress={
          // Only for testing
          () => {
            const key_idx = 0

            const key = {
              id: '0xF0cD725D2195b1D3f4BD038c3786005B793237DB',
              type: 'ledger',
              label: 'ledger-test-key',
              isExternallyStored: false,
              meta: {
                derivationPath: `m/44'/60'/${key_idx}'/0/0`,
                index: key_idx
              }
            }

            const signer = new LedgerSigner(key)
            signer.init(hardwareWallets[HARDWARE_WALLETS.LEDGER])
            signer.signMessage(hashMessage('some message'))
          }
        }
      />
      <Button
        text="sign typed data with ledger"
        onPress={
          // Only for testing
          () => {
            const key_idx = 0

            const key = {
              id: '0xF0cD725D2195b1D3f4BD038c3786005B793237DB',
              type: 'ledger',
              label: 'ledger-test-key',
              isExternallyStored: false,
              meta: {
                derivationPath: `m/44'/60'/${key_idx}'/0/0`,
                index: key_idx
              }
            }

            const signer = new LedgerSigner(key)
            signer.init(hardwareWallets[HARDWARE_WALLETS.LEDGER])

            const typedData = {
              types: {
                EIP712Domain: [
                  { name: 'name', type: 'string' },
                  { name: 'version', type: 'string' },
                  { name: 'chainId', type: 'uint256' },
                  { name: 'verifyingContract', type: 'address' },
                  { name: 'salt', type: 'bytes32' }
                ],
                Person: [
                  { name: 'name', type: 'string' },
                  { name: 'age', type: 'uint256' },
                  { name: 'address', type: 'string' }
                ],
                Message: [
                  { name: 'sender', type: 'Person' },
                  { name: 'recipient', type: 'Person' },
                  { name: 'content', type: 'string' }
                ]
              },
              primaryType: 'Message',
              domain: {
                name: 'MyDapp',
                version: '1.0',
                chainId: 1,
                verifyingContract: '0x1234567890123456789012345678901234567890',
                salt: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
              },
              message: {
                sender: {
                  name: 'Alice',
                  age: 30,
                  address: '0x1234567890123456789012345678901234567890'
                },
                recipient: {
                  name: 'Bob',
                  age: 25,
                  address: '0x0987654321098765432109876543210987654321'
                },
                content: 'Hello, Bob!'
              }
            }

            signer.signTypedData(
              typedData.domain,
              typedData.types,
              typedData.message,
              typedData.primaryType
            )
          }
        }
      />
    </>
  )
}

export default React.memo(LedgerManager)
