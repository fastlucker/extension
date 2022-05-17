import React from 'react'
import isEqual from 'react-fast-compare'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import TxnPreview from '@modules/common/components/TxnPreview'
import accountPresets from '@modules/common/constants/accountPresets'
import networks from '@modules/common/constants/networks'
import { getTransactionSummary } from '@modules/common/services/humanReadableTransactions/transactionSummary'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const BundleDetailedPreview = ({ bundle = {}, mined = false, hasBottomSpacing }: any) => {
  const network: any = networks?.find((x) => x.id === bundle?.network)
  const { t } = useTranslation()

  if (!Array.isArray(bundle?.txns)) {
    return (
      <Panel type="filled">
        <Text appearance="danger">{t('Bundle has no transactions (should never happen)')}</Text>
      </Panel>
    )
  }

  // eslint-disable-next-line no-unsafe-optional-chaining
  const lastTxn = bundle?.txns[bundle?.txns?.length - 1]
  // terribly hacky; @TODO fix
  // all of the values are prob checksummed so we may not need toLowerCase
  const lastTxnSummary = getTransactionSummary(lastTxn, bundle.network, bundle.identity)
  const hasFeeMatch = lastTxnSummary.match(new RegExp(`to ${accountPresets.feeCollector}`, 'i'))
  const txns = hasFeeMatch ? bundle.txns.slice(0, -1) : bundle.txns
  const toLocaleDateTime = (date: any) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

  return (
    <Panel type="filled" contentContainerStyle={{ flex: 0 }} style={{ flex: 0 }}>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.pbTy]}>
        <Text fontSize={12} style={spacings.mrSm}>
          {t('Transactions: {{totalNumTxns}} out of {{totalNumTxns}}', {
            totalNumTxns: txns.length
          })}
        </Text>
      </View>
      {txns.map((txn: any, i: number) => (
        <TxnPreview
          // eslint-disable-next-line react/no-array-index-key
          key={i} // safe to do this, individual TxnPreviews won't change within a specific bundle
          txn={txn}
          network={bundle.network}
          account={bundle.identity}
          mined={mined}
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
      <View style={[spacings.ptSm, hasBottomSpacing && spacings.pbMd]}>
        {hasFeeMatch ? (
          <View style={[flexboxStyles.directionRow, spacings.mbTy, flexboxStyles.alignCenter]}>
            <Text style={flexboxStyles.flex1} weight="medium" fontSize={12}>
              {t('Fee')}
            </Text>
            <Text fontSize={12}>{lastTxnSummary.slice(5, -hasFeeMatch[0].length)}</Text>
          </View>
        ) : null}
        <View style={[flexboxStyles.directionRow, spacings.mbTy, flexboxStyles.alignCenter]}>
          <Text style={flexboxStyles.flex1} fontSize={12} weight="medium">
            {t('Submitted on')}
          </Text>
          <Text fontSize={12}>
            {bundle.submittedAt && toLocaleDateTime(new Date(bundle.submittedAt)).toString()}
          </Text>
        </View>
        {bundle.replacesTxId ? (
          <View style={spacings.mbSm}>
            <Text>
              {t('Replaces transaction: ')} {bundle?.replacesTxId}
            </Text>
          </View>
        ) : null}
        {bundle.txId ? (
          <View style={[flexboxStyles.directionRow, spacings.mbSm, flexboxStyles.alignCenter]}>
            <Text style={flexboxStyles.flex1} weight="medium" fontSize={12}>
              {t('Block Explorer')}
            </Text>
            <Text
              onPress={() => Linking.openURL(`${network.explorerUrl}/tx/${bundle.txId}`)}
              underline
              fontSize={12}
            >
              {network.explorerUrl?.split('/')[2]}
            </Text>
          </View>
        ) : null}
      </View>
    </Panel>
  )
}

const MemoizedBundleDetailedPreview = React.memo(BundleDetailedPreview, isEqual)

export default MemoizedBundleDetailedPreview
