import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Title from '@common/components/Title'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import useWalletControllerRequest from '@web/hooks/useWalletControllerRequest'
import AccountsList from '@web/modules/accounts-importer/components/AccountsList'
import LedgerManager from '@web/modules/accounts-importer/components/LedgerManager'
import TrezorManager from '@web/modules/accounts-importer/components/TrezorManager'
import { AccountsPaginationProvider } from '@web/modules/accounts-importer/contexts/accountsPaginationContext'
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

const WALLET_MAP = {
  [HARDWARE_WALLETS.LEDGER]: LedgerManager,
  [HARDWARE_WALLETS.TREZOR]: TrezorManager
}

const AccountsImporterScreen = () => {
  const { params } = useRoute()
  const { addToast } = useToast()
  const { goBack } = useNavigation()
  const { hardwareWallets } = useHardwareWallets()
  const { t } = useTranslation()

  const { walletType, isMnemonics, isWebHID, ledgerLive, path, brand } = params

  const isGrid = walletType === HARDWARE_WALLETS.GRIDPLUS
  const isLedger = walletType === HARDWARE_WALLETS.LEDGER
  const isTrezor = walletType === HARDWARE_WALLETS.TREZOR

  useEffect(() => {
    if (!walletType) {
      goBack()
    }
  }, [goBack, walletType])

  if (isLedger || isTrezor) {
    const closeConnect = React.useCallback(() => {
      try {
        hardwareWallets[walletType].cleanUp()
      } catch (e) {
        console.log(e)
      }
    }, [hardwareWallets, walletType])

    useEffect(() => {
      window.addEventListener('beforeunload', () => {
        closeConnect()
      })

      return () => {
        closeConnect()
      }
    }, [closeConnect])

    const WalletManager = WALLET_MAP[walletType]
    const name = walletType

    return (
      <AccountsPaginationProvider>
        <View style={[spacings.mh, spacings.pv]}>
          <Title>{t('Connected to a {{name}} hardware device', { name })}</Title>
          <WalletManager />
        </View>
      </AccountsPaginationProvider>
    )
  }

  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<any[]>([])
  const [importedAccounts, setImportedAccounts] = useState<any[]>([])

  const [end, setEnd] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const [getAccounts] = useWalletControllerRequest(
    async (firstFlag, start?, end?, cb?): Promise<Account[]> => {
      setIsLoading(true)

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
          addToast(t('No accounts found'))

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
            hardwareWallets[walletType]?.cleanUp()
          } catch (e) {
            console.log(e)
          }
        } else {
          addToast(t('Please check the connection with your wallet.'))
        }

        setIsLoading(false)
      }
    }
  )

  const init = async () => {
    // setHasError(false)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _importedAccounts = await hardwareWallets[walletType].getAccounts()

    setImportedAccounts(_importedAccounts)
    getAccounts(true)
  }

  useEffect(() => {
    if (walletType) {
      init()
    }
  }, [walletType])

  useEffect(() => {
    if (!walletType) return () => {}

    return () => {
      try {
        hardwareWallets[walletType].cleanUp()
      } catch (e) {
        console.log(e)
      }
    }
  }, [hardwareWallets, walletType])

  return (
    <AccountsPaginationProvider walletType={walletType}>
      <GradientBackgroundWrapper>
        <Wrapper>
          {isGrid && (
            <Title>{t('Connected to a {{walletType}} hardware device', { walletType })}</Title>
          )}
          <AccountsList accounts={accounts} loading={isLoading} />
        </Wrapper>
      </GradientBackgroundWrapper>
    </AccountsPaginationProvider>
  )
}

export default AccountsImporterScreen
