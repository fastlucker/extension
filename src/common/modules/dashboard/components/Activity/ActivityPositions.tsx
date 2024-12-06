import React, { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatListProps, View } from 'react-native'

import shortenAddress from '@ambire-common/utils/shortenAddress'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import ActivityPositionsSkeleton from '@common/modules/dashboard/components/Activity/ActivityPositionsSkeleton'
import DashboardBanners from '@common/modules/dashboard/components/DashboardBanners'
import DashboardPageScrollContainer from '@common/modules/dashboard/components/DashboardPageScrollContainer'
import TabsAndSearch from '@common/modules/dashboard/components/TabsAndSearch'
import { TabType } from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tab/Tab'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import SubmittedTransactionSummary from '@web/modules/settings/components/TransactionHistory/SubmittedTransactionSummary'
import { getUiType } from '@web/utils/uiType'

import styles from './styles'

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  initTab?: { [key: string]: boolean }
  sessionId: string
  onScroll: FlatListProps<any>['onScroll']
}

const { isPopup } = getUiType()

const ITEMS_PER_PAGE = 10

const ActivityPositions: FC<Props> = ({ openTab, sessionId, setOpenTab, initTab, onScroll }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { dispatch } = useBackgroundService()
  const { accountsOps } = useActivityControllerState()
  const { account, dashboardNetworkFilter } = useSelectedAccountControllerState()
  const { networks } = useNetworksControllerState()

  useEffect(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_SET_ACC_OPS_FILTERS',
      params: {
        sessionId,
        filters: {
          account: account!.addr,
          ...(dashboardNetworkFilter && { network: dashboardNetworkFilter })
        },
        pagination: {
          itemsPerPage: ITEMS_PER_PAGE,
          fromPage: 0
        }
      }
    })
  }, [openTab, account, dispatch, dashboardNetworkFilter, sessionId])

  const renderItem = useCallback(
    ({ item }: any) => {
      if (item === 'header') {
        return (
          <View style={{ backgroundColor: theme.primaryBackground }}>
            <TabsAndSearch openTab={openTab} setOpenTab={setOpenTab} sessionId={sessionId} />
          </View>
        )
      }

      if (item === 'empty') {
        return (
          <Text fontSize={16} weight="medium" style={styles.noPositions}>
            {t('No transactions history for {{account}}', {
              account: `${account!.preferences.label} (${shortenAddress(account!.addr, 10)})`
            })}
            {dashboardNetworkFilter && (
              <>
                {' '}
                {t('on {{network}}', {
                  network: networks.find((network) => network.id === dashboardNetworkFilter)!.name
                })}
              </>
            )}
          </Text>
        )
      }

      if (!initTab?.activity || !item || item === 'keep-this-to-avoid-key-warning') return null

      if (item === 'skeleton') {
        return <ActivityPositionsSkeleton amount={4} />
      }

      if (item === 'load-more') {
        if (!accountsOps[sessionId]) return null

        const { result } = accountsOps[sessionId]
        const hasMoreTxnToLoad = result.currentPage + 1 < result.maxPages

        if (!hasMoreTxnToLoad) return null

        return (
          <View>
            <Button
              type="secondary"
              size="small"
              style={[flexbox.alignSelfCenter, spacings.mbSm]}
              onPress={() => {
                dispatch({
                  type: 'MAIN_CONTROLLER_ACTIVITY_SET_ACC_OPS_FILTERS',
                  params: {
                    sessionId,
                    filters: {
                      account: account!.addr,
                      ...(dashboardNetworkFilter && { network: dashboardNetworkFilter })
                    },
                    pagination: {
                      itemsPerPage: accountsOps[sessionId].pagination.itemsPerPage + ITEMS_PER_PAGE,
                      fromPage: 0
                    }
                  }
                })
              }}
              text={t('Show more')}
            />
          </View>
        )
      }

      return (
        <SubmittedTransactionSummary
          key={item.txnId}
          submittedAccountOp={item}
          showFee={false}
          enableExpand={false}
          showHeading={false}
          style={spacings.mbSm}
          size="md"
          blockExplorerAlignedRight
          showNetworkBadge
        />
      )
    },
    [
      dashboardNetworkFilter,
      initTab?.activity,
      openTab,
      setOpenTab,
      t,
      theme,
      dispatch,
      account,
      accountsOps,
      sessionId,
      networks
    ]
  )

  const keyExtractor = useCallback((positionOrElement: any) => {
    if (typeof positionOrElement === 'string') return positionOrElement

    return positionOrElement.txnId
  }, [])

  return (
    <DashboardPageScrollContainer
      tab="activity"
      openTab={openTab}
      ListHeaderComponent={<DashboardBanners />}
      data={[
        'header',
        !accountsOps ? 'skeleton' : 'keep-this-to-avoid-key-warning',
        ...(initTab?.activity && accountsOps?.[sessionId]?.result.items.length
          ? accountsOps[sessionId].result.items
          : []),
        accountsOps?.[sessionId] && !accountsOps[sessionId].result.items.length ? 'empty' : '',
        'load-more'
      ]}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={isPopup ? 5 : 2.5}
      initialNumToRender={isPopup ? 10 : 20}
      windowSize={9} // Larger values can cause performance issues.
      onScroll={onScroll}
    />
  )
}

export default React.memo(ActivityPositions)
