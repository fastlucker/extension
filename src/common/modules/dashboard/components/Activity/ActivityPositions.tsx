import React, { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatListProps, View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/network'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import DashboardBanners from '@common/modules/dashboard/components/DashboardBanners'
import DashboardPageScrollContainer from '@common/modules/dashboard/components/DashboardPageScrollContainer'
import TabsAndSearch from '@common/modules/dashboard/components/TabsAndSearch'
import { TabType } from '@common/modules/dashboard/components/TabsAndSearch/Tabs/Tab/Tab'
import { getUiType } from '@web/utils/uiType'

import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import SubmittedTransactionSummary from '@web/modules/settings/components/TransactionHistory/SubmittedTransactionSummary'
import spacings from '@common/styles/spacings'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import { networks } from '@ambire-common/consts/networks'
import Button from '@common/components/Button'
import flexbox from '@common/styles/utils/flexbox'
import { nanoid } from 'nanoid'
import ActivityPositionsSkeleton from './ActivityPositionsSkeleton'
import styles from './styles'

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  initTab?: { [key: string]: boolean }
  filterByNetworkId: NetworkId
  onScroll: FlatListProps<any>['onScroll']
}

const { isPopup } = getUiType()

const ITEMS_PER_PAGE = 10

const ActivityPositions: FC<Props> = ({
  openTab,
  setOpenTab,
  initTab,
  onScroll,
  filterByNetworkId
}) => {
  const [sessionId] = useState(nanoid())
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { dispatch } = useBackgroundService()
  const { accountsOps } = useActivityControllerState()
  const { account } = useSelectedAccountControllerState()

  useEffect(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_SET_ACC_OPS_FILTERS',
      params: {
        sessionId,
        filters: {
          account: account!.addr,
          ...(filterByNetworkId && { network: filterByNetworkId })
        },
        pagination: {
          itemsPerPage: ITEMS_PER_PAGE,
          fromPage: 0
        }
      }
    })
  }, [openTab, account, dispatch, filterByNetworkId, sessionId])

  useEffect(() => {
    return () => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACTIVITY_RESET_ACC_OPS_FILTERS',
        params: { sessionId }
      })
    }
  }, [dispatch, sessionId])

  const renderItem = useCallback(
    ({ item }: any) => {
      if (item === 'header') {
        return (
          <View style={{ backgroundColor: theme.primaryBackground }}>
            <TabsAndSearch openTab={openTab} setOpenTab={setOpenTab} />
          </View>
        )
      }

      if (item === 'empty') {
        return (
          <Text fontSize={16} weight="medium" style={styles.noPositions}>
            {t('No transactions history for {{account}}', {
              account: `${account!.preferences.label} (${shortenAddress(account!.addr, 10)})`
            })}
            {filterByNetworkId && (
              <>
                {' '}
                {t('on {{network}}', {
                  network: networks.find((network) => network.id === filterByNetworkId)!.name
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
                      ...(filterByNetworkId && { network: filterByNetworkId })
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
      filterByNetworkId,
      initTab?.activity,
      openTab,
      setOpenTab,
      t,
      theme,
      dispatch,
      account,
      accountsOps,
      sessionId
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
