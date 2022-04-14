import React, { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import OpenIcon from '@assets/svg/OpenIcon'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import TxnPreview from '@modules/common/components/TxnPreview'
import accountPresets from '@modules/common/constants/accountPresets'
import { getTransactionSummary } from '@modules/common/services/humanReadableTransactions/transactionSummary'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { DetailedBundleContext } from '@modules/send/contexts/detailedBundleContext'

import styles from './styles'

const HIT_SLOP = { bottom: 15, left: 12, right: 15, top: 15 }

const BundleSimplePreview = ({ bundle, mined = false, actions }: any) => {
  const { t } = useTranslation()
  const { setOpenedBundle, setMined } = useContext(DetailedBundleContext)

  if (!Array.isArray(bundle.txns)) {
    return (
      <Panel contentContainerStyle={styles.panel} type="filled">
        <Text appearance="danger">{t('Bundle has no transactions (should never happen)')}</Text>
      </Panel>
    )
  }

  const lastTxn = bundle.txns[bundle.txns.length - 1]
  // terribly hacky; @TODO fix
  // all of the values are prob checksummed so we may not need toLowerCase
  const lastTxnSummary = getTransactionSummary(lastTxn, bundle.network, bundle.identity)
  const hasFeeMatch = lastTxnSummary.match(new RegExp(`to ${accountPresets.feeCollector}`, 'i'))
  const txns = hasFeeMatch ? bundle.txns.slice(0, -1) : bundle.txns

  const numOfDisplayedTxns = txns.length > 2 ? 2 : txns.length

  const toLocaleDateTime = (date: any) =>
    `${date.toLocaleDateString()} (${date.toLocaleTimeString()})`

  return (
    <Panel contentContainerStyle={styles.panel} type="filled">
      {!!mined && (
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.pbTy]}>
          <Text fontSize={12} style={spacings.mrSm}>
            {t('Transactions: {{numOfDisplayedTxns}} out of {{totalNumTxns}}', {
              numOfDisplayedTxns,
              totalNumTxns: txns.length
            })}
          </Text>
          <Text style={flexboxStyles.flex1} numberOfLines={1} fontSize={10}>
            {bundle.submittedAt && toLocaleDateTime(new Date(bundle.submittedAt)).toString()}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setOpenedBundle(bundle)
              setMined(mined)
            }}
            hitSlop={HIT_SLOP}
          >
            <OpenIcon />
          </TouchableOpacity>
        </View>
      )}
      {txns.slice(0, 2).map((txn: any, i: number) => (
        <TxnPreview
          // eslint-disable-next-line react/no-array-index-key
          key={i} // safe to do this, individual TxnPreviews won't change within a specific bundle
          txn={txn}
          network={bundle.network}
          account={bundle.identity}
          mined={mined}
          disableExpand
        />
      ))}
      {!!bundle.executed && !bundle.executed?.success && (
        <View>
          <Trans>
            <Text appearance="danger">
              {'Error: '} {bundle.executed?.errorMsg || 'unknown error'}
            </Text>
          </Trans>
        </View>
      )}
      {!!actions && actions}
    </Panel>
  )
}

export default BundleSimplePreview
