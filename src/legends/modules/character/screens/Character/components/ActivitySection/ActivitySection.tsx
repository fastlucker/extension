import React from 'react'

import { networks } from '@ambire-common/consts/networks'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import Alert from '@legends/components/Alert'
import useActivityContext from '@legends/hooks/useActivityContext'

import SectionHeading from '../SectionHeading'
import styles from './ActivitySection.module.scss'

const ActivitySection = () => {
  const { activity, isLoading, error } = useActivityContext()

  return (
    <div className={styles.wrapper}>
      <SectionHeading>Legends Activity</SectionHeading>
      <p>{isLoading ? 'Loading ...' : ''}</p>
      {error && <Alert type="error" title={error} />}
      {activity && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Network</th>
              <th>Submitted at</th>
              <th>Total XP</th>
              <th>Legends actions</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((act) => {
              const network = networks.find(({ id }) => id === act.network)
              const txnId = shortenAddress(act.txId, 12)

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
                        {txnId}
                      </a>
                    ) : (
                      txnId
                    )}
                  </td>
                  <td>{act.network}</td>
                  <td>{new Date(act.submittedAt).toLocaleString()}</td>
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
    </div>
  )
}

export default ActivitySection
