import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Title from '@common/components/Title'
import Wrapper from '@common/components/Wrapper'
import useRoute from '@common/hooks/useRoute'
import useWalletControllerRequest from '@web/hooks/useWalletControllerRequest'
import HDManager from '@web/modules/accounts-importer/components/HDManager'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'

export interface Account {
  type: string
  address: string
  brandName: string
  alianName?: string
  displayBrandName?: string
  index?: number
  balance?: number
}

const AccountsImporterScreen = () => {
  const { params } = useRoute()

  const { walletType, isMnemonics, isWebHID, ledgerLive, path, brand } = params

  const isGrid = walletType === HARDWARE_WALLETS.GRIDPLUS
  const isLedger = walletType === HARDWARE_WALLETS.LEDGER
  const isTrezor = walletType === HARDWARE_WALLETS.TREZOR

  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<any[]>([])
  const [importedAccounts, setImportedAccounts] = useState<any[]>([])

  const [end, setEnd] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const { hardwareWallets } = useHardwareWallets()
  const { t } = useTranslation()

  if (isLedger || isTrezor) {
    return <HDManager walletType={walletType} />
  }

  const [getAccounts] = useWalletControllerRequest(
    async (firstFlag, start?, end?, cb?): Promise<Account[]> => {
      setIsLoading(true)

      console.log('is firstFlag', firstFlag)
      return firstFlag
        ? // eslint-disable-next-line @typescript-eslint/return-await
          await hardwareWallets[walletType].getFirstPage()
        : end && !isGrid && !ledgerLive
        ? // eslint-disable-next-line @typescript-eslint/return-await
          await hardwareWallets[walletType].getAddresses(start, end)
        : // eslint-disable-next-line @typescript-eslint/return-await
          await hardwareWallets[walletType].getNextPage()
    },
    {
      onSuccess(_accounts, { args: [, , , cb] }) {
        if (_accounts.length <= 0) {
          setIsLoading(false)
          // message.error('No accounts found')
          return
        }
        if (_accounts.length < 5) {
          throw new Error(t('You need to make use your last account before you can add a new one'))
        }
        setIsLoading(false)
        setAccounts(_accounts)
        cb?.()
      },
      onError(err) {
        if (isLedger) {
          // setHasError(true)
          try {
            // wallet.requestKeyring(keyring, 'cleanUp', keyringId.current ?? null)
          } catch (e) {
            console.log(e)
          }
        } else {
          // message.error('Please check the connection with your wallet')
        }

        setIsLoading(false)
      }
    }
  )

  const init = async () => {
    // setHasError(false)

    // eslint-disable-next-line @typescript-eslint/naming-convention
    console.log('init')
    const _importedAccounts = await hardwareWallets[walletType].getAccounts()

    setImportedAccounts(_importedAccounts)
    getAccounts(true)
  }

  useEffect(() => {
    init()
    // if (!isMnemonics) {
    //   stats.report('connectHardware', {
    //     type: keyring
    //   })
    // }
    return () => {
      // wallet.requestKeyring(keyring, 'cleanUp', keyringId.current ?? null)
    }
  }, [])

  console.log('AccountsImporterScreen params: ', params)
  console.log('accounts', accounts)
  console.log('imported accounts', importedAccounts)
  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <Title>Accounts Importer Screen</Title>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default AccountsImporterScreen
