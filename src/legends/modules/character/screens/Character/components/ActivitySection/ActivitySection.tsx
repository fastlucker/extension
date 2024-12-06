import React, { useEffect, useState } from 'react'

import { networks } from '@ambire-common/consts/networks'
import CoinIcon from '@legends/common/assets/svg/CoinIcon'
import SwordIcon from '@legends/common/assets/svg/SwordIcon'
import Alert from '@legends/components/Alert'
import ArbitrumLogo from '@legends/components/NetworkIcons/ArbitrumLogo'
import BaseLogo from '@legends/components/NetworkIcons/BaseLogo'
import EthereumLogo from '@legends/components/NetworkIcons/EthereumLogo'
import OptimismLogo from '@legends/components/NetworkIcons/OptimismLogo'
import ScrollLogo from '@legends/components/NetworkIcons/ScrollLogo'
import Spinner from '@legends/components/Spinner'
import useAccountContext from '@legends/hooks/useAccountContext'
import useActivity from '@legends/hooks/useActivity'
import useRecentActivityContext from '@legends/hooks/useRecentActivityContext'
import { Networks } from '@legends/modules/legends/types'

import SectionHeading from '../SectionHeading'
import styles from './ActivitySection.module.scss'
import Pagination from './Pagination'

const NETWORK_ICONS: { [key in Networks]: React.ReactNode } = {
  ethereum: <EthereumLogo />,
  base: <BaseLogo />,
  arbitrum: <ArbitrumLogo />,
  optimism: <OptimismLogo />,
  scroll: <ScrollLogo />
}

const ActivitySection = () => {
  const { activity: recentActivity } = useRecentActivityContext()
  const { connectedAccount } = useAccountContext()
  const [page, setPage] = useState(0)
  const { activity, isLoading, error, getActivity } = useActivity({
    page,
    accountAddress: connectedAccount
  })
  const { transactions, totalTransactionCount } = activity || {}

  useEffect(() => {
    if (
      page !== 0 ||
      // If the user had 0 transactions before, !0 will be true
      // so we need to check if totalTransactionCount is undefined
      !recentActivity?.totalTransactionCount ||
      typeof totalTransactionCount === 'undefined'
    )
      return

    const isRecentActivityNewer = recentActivity?.totalTransactionCount > totalTransactionCount

    if (isRecentActivityNewer) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getActivity()
    }
  }, [getActivity, page, recentActivity?.totalTransactionCount, totalTransactionCount])

  return (
    <div className={styles.wrapper}>
      <SectionHeading>Activity</SectionHeading>
      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      )}
      {error && <Alert type="error" title={error} />}
      {transactions?.length && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Network</th>
              <th>Total XP</th>
              <th>Legends</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((act) => {
              const network = networks.find(({ id }) => id === act.network)

              return (
                <tr key={act.txId}>
                  <td>
                    {network ? (
                      <a
                        href={`${network.explorerUrl}/tx/${act.txId}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.link}
                      >
                        {new Date(act.submittedAt).toLocaleString([], {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </a>
                    ) : (
                      new Date(act.submittedAt).toLocaleString()
                    )}
                  </td>
                  <td>{NETWORK_ICONS[act.network]}</td>
                  <td>
                    <span className={styles.xp}>{act.legends.totalXp}</span>
                    <CoinIcon width={32} height={32} className={styles.coin} />
                  </td>
                  <td className={styles.legendsWrapper}>
                    {act.legends.activities?.map((legendActivity) => (
                      <div className={styles.badge} key={legendActivity.action + legendActivity.xp}>
                        <SwordIcon width={32} height={32} className={styles.sword} />
                        {legendActivity.cardTitle} (+{legendActivity.xp} XP)
                      </div>
                    ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {!transactions?.length && !isLoading && !error && <p>No activity found for this account</p>}
      {activity && <Pagination activity={activity} page={page} setPage={setPage} />}
    </div>
  )
}

export default ActivitySection
