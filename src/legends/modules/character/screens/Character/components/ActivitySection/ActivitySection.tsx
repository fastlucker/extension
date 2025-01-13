import React, { useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'

import { networks } from '@ambire-common/consts/networks'
import LinkIcon from '@common/assets/svg/LinkIcon'
import spacings from '@common/styles/spacings'
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
  ethereum: <EthereumLogo width={24} height={24} />,
  base: <BaseLogo width={24} height={24} />,
  arbitrum: <ArbitrumLogo width={24} height={24} />,
  optimism: <OptimismLogo width={24} height={24} />,
  scroll: <ScrollLogo width={24} height={24} />
}

const ActivitySection = () => {
  const { connectedAccount: accountAddress } = useAccountContext()
  const [page, setPage] = useState(0)
  const recentActivity = useRecentActivityContext()
  const historyActivity = useActivity({ page: page === 0 ? null : page, accountAddress })

  const { activity, isLoading, error, getActivity } = page === 0 ? recentActivity : historyActivity

  const { transactions, totalTransactionCount } = activity || {}

  useEffect(() => {
    if (
      page !== 0 ||
      // If the user had 0 transactions before, !0 will be true
      // so we need to check if totalTransactionCount is undefined
      !recentActivity?.activity?.totalTransactionCount ||
      typeof totalTransactionCount === 'undefined'
    )
      return

    const isRecentActivityNewer =
      recentActivity?.activity?.totalTransactionCount > totalTransactionCount

    if (isRecentActivityNewer) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getActivity()
    }
  }, [getActivity, page, recentActivity?.activity?.totalTransactionCount, totalTransactionCount])

  return (
    <div className={styles.wrapper}>
      <SectionHeading>Activity</SectionHeading>
      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      )}
      {error && <Alert type="error" title={error} />}
      {transactions?.length ? (
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
                    <div className={styles.linksWrapper}>
                      {new Date(act.submittedAt).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}

                      {!!network && (
                        <>
                          <a
                            href={`https://benzin.ambire.com/?chainId=${String(
                              network.chainId
                            )}&txnId=${act.txId}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.link}
                          >
                            View transaction
                            <LinkIcon style={spacings.phTy} />
                          </a>
                          <a
                            href={`${network.explorerUrl}/tx/${act.txId}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.link}
                          >
                            View in block explorer
                            <LinkIcon style={spacings.phTy} />
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    {NETWORK_ICONS[act.network as Networks]}
                    <span className={styles.network}>{act.network}</span>
                  </td>
                  <td>
                    <span className={styles.xp}>{act.legends.totalXp}</span>
                    <CoinIcon width={24} height={24} className={styles.coin} />
                  </td>
                  <td className={styles.legendsWrapper}>
                    {act.legends.activities?.map((legendActivity, i) => (
                      <React.Fragment
                        key={`${act.txId}-${legendActivity.action}-${legendActivity.xp}`}
                      >
                        <div
                          className={styles.badge}
                          key={legendActivity.action + legendActivity.xp}
                          data-tooltip-id={`tooltip-${act.txId}-${i}`}
                        >
                          <SwordIcon width={24} height={24} className={styles.sword} />
                          {legendActivity.cardTitle} (+{legendActivity.xp} XP)
                        </div>
                        <Tooltip
                          id={`tooltip-${act.txId}-${i}`}
                          place="top"
                          className={styles.tooltip}
                        >
                          {legendActivity.labelText}
                        </Tooltip>
                      </React.Fragment>
                    ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : null}
      {!transactions?.length && !isLoading && !error && <p>No activity found for this account</p>}
      {activity ? <Pagination activity={activity} page={page} setPage={setPage} /> : null}
    </div>
  )
}

export default React.memo(ActivitySection)
