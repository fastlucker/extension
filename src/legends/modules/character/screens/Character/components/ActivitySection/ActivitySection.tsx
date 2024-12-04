import React, { useState } from 'react'

import { networks } from '@ambire-common/consts/networks'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import Alert from '@legends/components/Alert'
import Spinner from '@legends/components/Spinner'
import useAccountContext from '@legends/hooks/useAccountContext'
import useActivity from '@legends/hooks/useActivity'

import SectionHeading from '../SectionHeading'
import styles from './ActivitySection.module.scss'
import Pagination from './Pagination'

const ActivitySection = () => {
  const { connectedAccount } = useAccountContext()
  const [page, setPage] = useState(0)
  const { activity, isLoading, error } = useActivity({
    page,
    accountAddress: connectedAccount
  })
  const { transactions } = activity || {}

  return (
    <div className={styles.wrapper}>
      <SectionHeading>Legends Activity</SectionHeading>
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
              <th>Legends actions</th>
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
                        {new Date(act.submittedAt).toLocaleString()}
                      </a>
                    ) : (
                      new Date(act.submittedAt).toLocaleString()
                    )}
                  </td>
                  <td>{act.network}</td>
                  <td>{act.legends.totalXp}</td>
                  <td>
                    {act.legends.activities?.map((legendActivity) => (
                      <div key={legendActivity.action + legendActivity.xp}>
                        {legendActivity.action} (+{legendActivity.xp} xp)
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
