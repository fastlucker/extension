import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { SignedMessage, SubmittedAccountOp } from '@ambire-common/controllers/activity/activity'
import { Account } from '@ambire-common/interfaces/account'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Pagination from '@common/components/Pagination'
import Select from '@common/components/Select'
import getSelectStyles from '@common/components/Select/styles'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { Avatar } from '@web/modules/account-personalize/components/AccountPersonalizeCard/avatar'
import SettingsPage from '@web/modules/settings/components/SettingsPage'
import shortenAddress from '@web/utils/shortenAddress'

import SignedMessageSummary from '../../components/TransactionHistory/SignedMessageSummary'
import SubmittedTransactionSummary from '../../components/TransactionHistory/SubmittedTransactionSummary'
import Tabs, { TabId } from './Tabs'

type AccountOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

type NetworkOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

const ITEMS_PER_PAGE = 10

const formatAddressLabelInSelector = (label: string) => {
  if (label.length > (IS_SCREEN_SIZE_DESKTOP_LARGE ? 26 : 18))
    return `${label.slice(0, IS_SCREEN_SIZE_DESKTOP_LARGE ? 24 : 16)}...`

  return label
}

const TransactionHistorySettingsScreen = () => {
  const { networks, accountPreferences } = useSettingsControllerState()
  const activityState = useActivityControllerState()
  const mainState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const { styles: selectStyles } = useTheme(getSelectStyles)
  const [page, setPage] = useState(1)
  const [containerHeight, setContainerHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const { t } = useTranslation()

  const [account, setAccount] = useState<Account>(
    mainState.accounts.filter((acc) => acc.addr === mainState.selectedAccount)[0]
  )
  const [network, setNetwork] = useState<NetworkDescriptor>(
    networks.filter((n) => n.id === 'ethereum')[0]
  )
  const [tab, setTab] = useState<TabId>('transactions')

  const accountsOptions: AccountOption[] = useMemo(() => {
    return mainState.accounts.map((acc) => ({
      value: acc.addr,
      label: (
        <Text weight="medium" numberOfLines={1}>
          {`${formatAddressLabelInSelector(
            accountPreferences?.[acc.addr]?.label || ''
          )} (${shortenAddress(acc.addr, 10)})`}
        </Text>
      ),
      icon: <Avatar pfp={accountPreferences[acc.addr]?.pfp} size={30} />
    }))
  }, [accountPreferences, mainState.accounts])

  const networksOptions: NetworkOption[] = useMemo(
    () =>
      networks.map((n) => ({
        value: n.id,
        label: <Text weight="medium">{n.name}</Text>,
        icon: <NetworkIcon name={n.id as NetworkIconNameType} />
      })),
    [networks]
  )

  useEffect(() => {
    if (!account || !activityState.isInitialized) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_SET_FILTERS',
      params: {
        filters: {
          account: account.addr,
          network: network.id
        }
      }
    })
  }, [dispatch, account, network, tab, activityState.isInitialized])

  useEffect(() => {
    if (!activityState.isInitialized && account)
      dispatch({
        type: 'MAIN_CONTROLLER_ACTIVITY_INIT',
        params: {
          filters: {
            account: account.addr,
            network: network.id
          }
        }
      })
  }, [dispatch, account, network, activityState.isInitialized])

  useEffect(() => {
    if (tab !== 'transactions' || !activityState.isInitialized) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_SET_ACCOUNT_OPS_PAGINATION',
      params: {
        pagination: {
          itemsPerPage: ITEMS_PER_PAGE,
          fromPage: page - 1
        }
      }
    })
  }, [page, tab, activityState.isInitialized, dispatch])

  useEffect(() => {
    if (tab !== 'messages' || !activityState.isInitialized) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_SET_SIGNED_MESSAGES_PAGINATION',
      params: {
        pagination: {
          itemsPerPage: ITEMS_PER_PAGE,
          fromPage: page - 1
        }
      }
    })
  }, [page, tab, activityState.isInitialized, dispatch])

  useEffect(() => {
    setPage(1)
  }, [tab])

  const handleSetAccountValue = useCallback(
    (accountOption: AccountOption) => {
      setAccount(mainState.accounts.filter((acc) => acc.addr === accountOption.value)[0])
    },
    [mainState.accounts]
  )

  const handleSetNetworkValue = useCallback(
    (networkOption: NetworkOption) => {
      setNetwork(networks.filter((net) => net.id === networkOption.value)[0])
    },
    [networks]
  )

  const renderAccountOpsHistory = useCallback(() => {
    if (!activityState?.accountsOps?.items?.length) {
      return (
        <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
          <Trans>
            <Text style={text.center}>
              <Text fontSize={16}>{'No transactions history for\n'}</Text>
              <Text fontSize={16} weight="medium">
                {`${accountPreferences?.[account.addr]?.label} (${shortenAddress(
                  account.addr,
                  10
                )})`}
              </Text>
              <Text fontSize={16}>{' on '}</Text>
              <Text fontSize={16} weight="medium">
                {network.name}
              </Text>
            </Text>
          </Trans>
        </View>
      )
    }

    return activityState?.accountsOps?.items.map((item: SubmittedAccountOp, i) => (
      <SubmittedTransactionSummary
        key={item.txnId}
        submittedAccountOp={item}
        style={i !== activityState.accountsOps!.items.length - 1 ? spacings.mbLg : {}}
      />
    ))
  }, [account.addr, activityState.accountsOps, accountPreferences, network.name])

  const renderSignedMessagesHistory = useCallback(() => {
    if (!activityState?.signedMessages?.items?.length) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            flexbox.flex1,
            flexbox.alignCenter,
            flexbox.justifyCenter
          ]}
        >
          <Trans>
            <Text style={text.center}>
              <Text fontSize={16}>{'No signed messages history for\n'}</Text>
              <Text fontSize={16} weight="medium">
                {`${accountPreferences?.[account.addr]?.label} (${shortenAddress(
                  account.addr,
                  10
                )})`}
              </Text>
              {page > 1 && (
                <>
                  <Text>{' on page: '}</Text>
                  <Text fontSize={16} weight="medium">
                    {page}
                  </Text>
                </>
              )}
            </Text>
          </Trans>
        </View>
      )
    }

    return activityState?.signedMessages?.items.map((item, i) => (
      <SignedMessageSummary
        key={item.id}
        signedMessage={item as SignedMessage}
        style={i !== activityState.signedMessages!.items.length - 1 ? spacings.mbSm : {}}
      />
    ))
  }, [account.addr, activityState.signedMessages, accountPreferences, page])

  const renderCrossChainBridgeHistory = useCallback(() => {
    return (
      <View
        style={[StyleSheet.absoluteFill, flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}
      >
        <Text style={text.center} fontSize={16} weight="medium">
          {t('Coming soon')}
        </Text>
      </View>
    )
  }, [t])

  const hasScroll = useMemo(() => contentHeight > containerHeight, [contentHeight, containerHeight])
  const goToNextPageDisabled = useMemo(() => {
    if (tab === 'transactions')
      return (activityState?.accountsOps?.items?.length || 0) < ITEMS_PER_PAGE
    if (tab === 'messages')
      return (activityState?.signedMessages?.items?.length || 0) < ITEMS_PER_PAGE

    return true
  }, [activityState, tab])

  if (!activityState.isInitialized) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.center]}>
        <Spinner />
      </View>
    )
  }

  return (
    <SettingsPage currentPage="transaction-history" withPanelScrollView={false}>
      <Tabs selectedTab={tab} setTab={setTab} />
      <View style={[flexbox.directionRow, spacings.mbLg]}>
        <Select
          setValue={handleSetAccountValue}
          style={{ width: IS_SCREEN_SIZE_DESKTOP_LARGE ? 420 : 340, ...spacings.mr }}
          options={accountsOptions}
          value={accountsOptions.filter((opt) => opt.value === account.addr)[0]}
        />
        {tab !== 'messages' && (
          <Select
            setValue={handleSetNetworkValue}
            style={{ width: 260 }}
            options={networksOptions}
            value={networksOptions.filter((opt) => opt.value === network.id)[0]}
          />
        )}
      </View>
      <View style={[hasScroll && { paddingRight: 20 }, spacings.mbTy]}>
        {tab === 'messages' && !!activityState?.signedMessages?.items?.length && (
          <View style={[flexbox.directionRow, flexbox.flex1, spacings.phSm]}>
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
      </View>
      <ScrollView
        style={[spacings.mbXl, flexbox.flex1]}
        contentContainerStyle={{
          flexGrow: 1,
          ...spacings?.[hasScroll ? 'prSm' : 'pr0']
        }}
        onLayout={(e) => {
          setContainerHeight(e.nativeEvent.layout.height)
        }}
        onContentSizeChange={(_, height) => {
          setContentHeight(height)
        }}
        {...(tab === 'messages' && !!activityState.signedMessages?.items.length
          ? { stickyHeaderIndices: [0] }
          : {})}
      >
        {tab === 'transactions' && renderAccountOpsHistory()}
        {tab === 'messages' && renderSignedMessagesHistory()}
        {tab === 'cross-chain' && renderCrossChainBridgeHistory()}
      </ScrollView>
      <Pagination
        isNextDisabled={goToNextPageDisabled}
        style={{ marginLeft: 'auto' }}
        page={page}
        setPage={(p) => setPage(p)}
      />
    </SettingsPage>
  )
}

export default TransactionHistorySettingsScreen
