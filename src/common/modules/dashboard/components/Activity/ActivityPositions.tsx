import React, { FC, useCallback, useEffect } from 'react'
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

const ActivityPositions: FC<Props> = ({
  openTab,
  setOpenTab,
  initTab,
  onScroll,
  filterByNetworkId
}) => {
  // const { control, watch, setValue } = useForm({ mode: 'all', defaultValues: { search: '' } })
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { dispatch } = useBackgroundService()
  const { accountsOps } = useActivityControllerState()
  const { account } = useSelectedAccountControllerState()

  useEffect(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_INIT',
      params: {
        filters: {
          account: account!.addr
        }
      }
    })
  }, [openTab])

  // @TODO - to be discussed. It's always rendered, no matter on which `openTab` we are.
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

      if (item === 'skeleton') {
        return <ActivityPositionsSkeleton amount={4} />
      }

      if (!initTab?.activity || !item || item === 'keep-this-to-avoid-key-warning') return null

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
    [filterByNetworkId, initTab?.activity, openTab, setOpenTab, t, theme]
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
        ...(initTab?.activity && accountsOps?.items.length ? accountsOps.items : []),
        !accountsOps?.items.length ? 'empty' : ''
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
