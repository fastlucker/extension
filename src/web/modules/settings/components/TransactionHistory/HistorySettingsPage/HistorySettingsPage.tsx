import React, {
  ComponentType,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { Network } from '@ambire-common/interfaces/network'
import NetworkIcon from '@common/components/NetworkIcon'
import AccountOption from '@common/components/Option/AccountOption'
import Pagination from '@common/components/Pagination'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

const ITEMS_PER_PAGE = 10

interface Props {
  HistoryComponent: ComponentType<{
    page?: number
    network?: Network
    account: Account
  }>
  historyType: 'transactions' | 'messages'
}

const HistorySettingsPage: FC<Props> = ({ HistoryComponent, historyType }) => {
  const { networks } = useNetworksControllerState()
  const activityState = useActivityControllerState()
  const { accounts, selectedAccount } = useAccountsControllerState()
  const { dispatch } = useBackgroundService()
  const [page, setPage] = useState(1)
  const { t } = useTranslation()
  const { maxWidthSize } = useWindowSize()
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage(historyType)
  }, [setCurrentSettingsPage, historyType])

  const itemsTotal =
    (historyType === 'messages'
      ? activityState.signedMessages?.itemsTotal
      : activityState.accountsOps?.itemsTotal) || 0

  const [account, setAccount] = useState<Account>(
    accounts.filter((acc) => acc.addr === selectedAccount)[0]
  )
  const [network, setNetwork] = useState<Network>(networks.filter((n) => n.id === 'ethereum')[0])

  const accountsOptions: SelectValue[] = useMemo(() => {
    return accounts.map((acc) => ({
      value: acc.addr,
      label: <AccountOption acc={acc} />
    }))
  }, [accounts])

  const networksOptions: SelectValue[] = useMemo(
    () =>
      networks.map((n) => ({
        value: n.id,
        label: <Text weight="medium">{n.name}</Text>,
        icon: <NetworkIcon key={n.id} id={n.id} />
      })),
    [networks]
  )

  const isLoading = useMemo(
    () =>
      !activityState?.isInitialized ||
      // Prevents the flashing of old history state
      (activityState.filters?.account && account.addr !== activityState.filters.account) ||
      (activityState.filters?.network && network.id !== activityState.filters.network) ||
      // Transactions history must always have a network filter. If it doesn't, it means it's still loading
      (historyType === 'transactions' && !activityState.filters?.network),
    [
      account.addr,
      activityState?.filters?.account,
      activityState?.filters?.network,
      activityState?.isInitialized,
      historyType,
      network.id
    ]
  )

  useEffect(() => {
    if (
      !account ||
      !activityState.isInitialized ||
      (activityState?.filters?.account === account.addr &&
        activityState?.filters?.network === network.id)
    )
      return

    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_SET_FILTERS',
      params: {
        filters: {
          account: account.addr,
          network: network.id
        }
      }
    })
  }, [
    dispatch,
    account,
    network,
    activityState.isInitialized,
    activityState?.filters?.account,
    activityState?.filters?.network
  ])

  useEffect(() => {
    if (activityState.isInitialized || !account) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_INIT',
      params: {
        filters: {
          account: account.addr,
          network: network.id
        }
      }
    })
  }, [dispatch, account, network, activityState.isInitialized, selectedAccount])

  useEffect(() => {
    if (!activityState.isInitialized) return

    dispatch({
      type:
        historyType === 'transactions'
          ? 'MAIN_CONTROLLER_ACTIVITY_SET_ACCOUNT_OPS_PAGINATION'
          : 'MAIN_CONTROLLER_ACTIVITY_SET_SIGNED_MESSAGES_PAGINATION',
      params: {
        pagination: {
          itemsPerPage: ITEMS_PER_PAGE,
          fromPage: page - 1
        }
      }
    })
  }, [page, historyType, activityState.isInitialized, dispatch])

  const handleSetAccountValue = useCallback(
    (accountOption: SelectValue) => {
      setPage(1)
      setAccount(accounts.filter((acc) => acc.addr === accountOption.value)[0])
    },
    [accounts]
  )

  const handleSetNetworkValue = useCallback(
    (networkOption: SelectValue) => {
      setNetwork(networks.filter((net) => net.id === networkOption.value)[0])
    },
    [networks]
  )

  const goToNextPageDisabled = useMemo(() => {
    return ITEMS_PER_PAGE * page - itemsTotal >= 0
  }, [itemsTotal, page])

  return (
    <>
      <SettingsPageHeader
        title={historyType === 'messages' ? 'Signed Messages' : 'Transaction History'}
      />
      <View style={[flexbox.directionRow, spacings.mbLg]}>
        <Select
          setValue={handleSetAccountValue}
          containerStyle={{ width: maxWidthSize('xl') ? 420 : 340, ...spacings.mr }}
          options={accountsOptions}
          value={accountsOptions.filter((opt) => opt.value === account.addr)[0]}
        />
        {historyType !== 'messages' && (
          <Select
            setValue={handleSetNetworkValue}
            containerStyle={{ width: 260 }}
            options={networksOptions}
            value={networksOptions.filter((opt) => opt.value === network.id)[0]}
          />
        )}
      </View>
      {!isLoading ? (
        <>
          {historyType === 'messages' && !!activityState?.signedMessages?.items?.length && (
            <View style={[flexbox.directionRow, spacings.phSm, spacings.mbTy]}>
              <View style={flexbox.flex1}>
                <Text fontSize={14}>{t('Dapps')}</Text>
              </View>
              <View style={flexbox.flex1}>
                <Text fontSize={14}>{t('Submitted on')}</Text>
              </View>
              <View style={flexbox.flex1}>
                <Text fontSize={14}>{t('Sign type')}</Text>
              </View>
              <View style={{ width: 15, height: 1 }} />
            </View>
          )}
          <ScrollableWrapper
            style={[spacings.mbXl, flexbox.flex1]}
            {...(historyType === 'messages' && !!activityState.signedMessages?.items.length
              ? { stickyHeaderIndices: [0] }
              : {})}
          >
            <HistoryComponent page={page} account={account} network={network} />
          </ScrollableWrapper>
        </>
      ) : (
        <View style={[flexbox.flex1, flexbox.center]}>
          <Spinner />
        </View>
      )}
      <Pagination
        maxPages={Math.ceil(itemsTotal / ITEMS_PER_PAGE)}
        isNextDisabled={goToNextPageDisabled}
        style={{ marginLeft: 'auto' }}
        page={page}
        setPage={(p) => setPage(p)}
      />
    </>
  )
}

export default HistorySettingsPage
