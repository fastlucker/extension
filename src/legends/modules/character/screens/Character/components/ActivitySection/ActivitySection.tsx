import React from 'react'

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
import useActivityContext from '@legends/hooks/useActivityContext'
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
  const { activity, isLoading, error, setPage, currentPage } = useActivityContext()
  const { transactions } = activity || {}

  return (
    <div className={styles.wrapper}>
      <SectionHeading>Activity</SectionHeading>
      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      )}
      {error && <Alert type="error" title={error} />}
      {!isLoading && transactions?.length ? (
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
            {transactions.map(({ network: networkId, legends, submittedAt, userOpHash, txId }) => {
              const network = networks.find(({ id }) => id === networkId)

              return (
                <tr key={txId}>
                  <td>
                    <div className={styles.linksWrapper}>
                      {new Date(submittedAt).toLocaleString([], {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}

                      {!!network && (
                        <>
                          <a
                            href={`https://benzin.ambire.com/?chainId=${
                              network.chainId
                            }&txnId=${txId}${userOpHash ? `&userOpHash=${userOpHash}` : ''}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.link}
                          >
                            View transaction
                            <LinkIcon style={spacings.phTy} />
                          </a>
                          <a
                            href={`${network.explorerUrl}/tx/${txId}`}
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
                    {NETWORK_ICONS[networkId as Networks]}
                    <span className={styles.network}>{networkId}</span>
                  </td>
                  <td>
                    <span className={styles.xp}>{legends.totalXp}</span>
                    <CoinIcon width={24} height={24} className={styles.coin} />
                  </td>
                  <td className={styles.legendsWrapper}>
                    {legends.activities?.map((legendActivity, i) => (
                      <React.Fragment
                        key={`${txId}-${legendActivity.action}-${legendActivity.xp}-${i}`}
                      >
                        <div
                          className={styles.badge}
                          key={legendActivity.action + legendActivity.xp}
                          data-tooltip-id={`tooltip-${txId}-${i}`}
                        >
                          <SwordIcon width={24} height={24} className={styles.sword} />
                          {legendActivity.labelText} (+{legendActivity.xp} XP)
                        </div>
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
      {activity ? <Pagination activity={activity} page={currentPage} setPage={setPage} /> : null}
    </div>
  )
}

export default React.memo(ActivitySection)
